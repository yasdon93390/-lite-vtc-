import PDFDocument from 'pdfkit';

const ORANGE = '#FF6B1A';
const INK = '#0E1116';
const SOFT = '#6B7280';
const LINE = '#E5E7EB';

function eur(n) {
    return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(d) {
    return new Date(d).toLocaleDateString('fr-FR');
}

function buildHeader(doc, { user, type, number, date }) {
    doc.fontSize(22).fillColor(INK).font('Helvetica-Bold').text(user.company_name || 'Mon Entreprise', 50, 50);
    if (process.env.COMPANY_ADDRESS) {
        doc.fontSize(9).fillColor(SOFT).font('Helvetica').text(process.env.COMPANY_ADDRESS, 50, 78);
    }
    if (user.company_siret || process.env.COMPANY_SIRET) {
        doc.text('SIRET ' + (user.company_siret || process.env.COMPANY_SIRET), 50, 92);
    }

    doc.fillColor(ORANGE).fontSize(28).font('Helvetica-Bold').text(type, 380, 50, { width: 165, align: 'right' });
    doc.fillColor(INK).fontSize(10).font('Helvetica')
        .text(`N° ${number}`, 380, 88, { width: 165, align: 'right' })
        .text(`Émis le ${fmtDate(date)}`, 380, 102, { width: 165, align: 'right' });

    doc.moveTo(50, 135).lineTo(545, 135).strokeColor(LINE).lineWidth(0.7).stroke();
}

function buildClient(doc, client, y = 160) {
    doc.fontSize(9).fillColor(SOFT).font('Helvetica').text('CLIENT', 50, y);
    doc.fontSize(11).fillColor(INK).font('Helvetica-Bold').text(client?.name || 'Client', 50, y + 14);
    if (client?.address) doc.fontSize(9).fillColor(SOFT).font('Helvetica').text(client.address, 50, y + 30);
    if (client?.phone) doc.text(client.phone, 50, y + 44);
    if (client?.email) doc.text(client.email, 50, y + 58);
}

function buildTable(doc, items, startY) {
    let y = startY;

    // header
    doc.fillColor('#FAFBFC').rect(50, y, 495, 24).fill();
    doc.fillColor(SOFT).fontSize(8.5).font('Helvetica-Bold');
    doc.text('DÉSIGNATION', 60, y + 8);
    doc.text('QTÉ', 340, y + 8, { width: 35, align: 'right' });
    doc.text('UNITÉ', 380, y + 8, { width: 40, align: 'center' });
    doc.text('P.U. HT', 425, y + 8, { width: 50, align: 'right' });
    doc.text('TOTAL HT', 480, y + 8, { width: 60, align: 'right' });
    y += 30;

    doc.fillColor(INK).font('Helvetica').fontSize(9.5);
    items.forEach(it => {
        const labelHeight = doc.heightOfString(it.label, { width: 270 });
        const rowH = Math.max(20, labelHeight + 8);

        doc.text(it.label, 60, y, { width: 270 });
        doc.text(String(it.qty), 340, y, { width: 35, align: 'right' });
        doc.text(it.unit || '', 380, y, { width: 40, align: 'center' });
        doc.text(eur(it.unit_price), 425, y, { width: 50, align: 'right' });
        doc.font('Helvetica-Bold').text(eur(it.total), 480, y, { width: 60, align: 'right' });
        doc.font('Helvetica');

        y += rowH;
        doc.moveTo(50, y - 4).lineTo(545, y - 4).strokeColor(LINE).lineWidth(0.4).stroke();
    });

    return y;
}

function buildTotals(doc, { total_ht, total_tva, total_ttc, vat_rate }, y) {
    y += 16;
    doc.fontSize(10).font('Helvetica').fillColor(SOFT);
    doc.text('Total HT', 350, y, { width: 100, align: 'right' });
    doc.fillColor(INK).text(eur(total_ht), 460, y, { width: 80, align: 'right' });

    y += 18;
    doc.fillColor(SOFT).text(`TVA ${vat_rate}%`, 350, y, { width: 100, align: 'right' });
    doc.fillColor(INK).text(eur(total_tva), 460, y, { width: 80, align: 'right' });

    y += 24;
    doc.fillColor(ORANGE).rect(340, y - 6, 205, 28).fill();
    doc.fillColor('#fff').font('Helvetica-Bold').fontSize(12)
        .text('Total TTC', 350, y + 2, { width: 100, align: 'right' })
        .text(eur(total_ttc), 460, y + 2, { width: 80, align: 'right' });

    return y + 30;
}

function buildFooter(doc, footer) {
    doc.fontSize(8).fillColor(SOFT).font('Helvetica')
        .text(footer, 50, 770, { width: 495, align: 'center' });
}

async function build(payload, type = 'DEVIS') {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];
        doc.on('data', c => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        buildHeader(doc, {
            user: payload.user,
            type,
            number: payload.number,
            date: payload.date || new Date(),
        });
        buildClient(doc, payload.client);

        if (payload.title) {
            doc.fontSize(13).fillColor(INK).font('Helvetica-Bold').text(payload.title, 50, 240);
        }

        let y = buildTable(doc, payload.items, 270);
        y = buildTotals(doc, payload, y);

        if (type === 'DEVIS') {
            doc.fontSize(9).fillColor(SOFT).text(
                'Devis valable 30 jours. Pour acceptation, retournez ce devis signé avec la mention "Bon pour accord".',
                50, y + 20, { width: 495 }
            );
        } else if (type === 'FACTURE') {
            doc.fontSize(9).fillColor(SOFT).text(
                `Échéance de paiement : ${fmtDate(payload.due_date)}. Pénalités de retard 3× le taux légal au-delà.`,
                50, y + 20, { width: 495 }
            );
        }

        buildFooter(doc, `${payload.user.company_name || ''} — ${process.env.COMPANY_SIRET ?? ''} — Document généré par ChantierFlow AI`);

        doc.end();
    });
}

export const renderQuotePDF = (payload) => build(payload, 'DEVIS');
export const renderInvoicePDF = (payload) => build(payload, 'FACTURE');
