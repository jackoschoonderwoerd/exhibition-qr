import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { Artifact } from '../../models/artifact.model';


export async function downloadArtifactQrPdf(artifact: Artifact) {
    if (!artifact.id) return;

    const url = `${location.origin}/artifact/${artifact.id}`;

    // 🔽 Load logo PNG
    const logoDataUrl = await loadPngAsDataUrl('/logo.png');

    const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H'
    });

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    pdf.setFontSize(18);
    pdf.text(artifact.titleNL, centerX, 30, { align: 'center' });

    // QR code
    pdf.addImage(qrDataUrl, 'PNG', centerX - 40, 45, 80, 80);

    // White circle background
    pdf.setFillColor(255, 255, 255);
    pdf.circle(centerX, 85, 10, 'F');

    // Logo overlay
    pdf.addImage(logoDataUrl, 'PNG', centerX - 7, 78, 14, 14);

    pdf.setFontSize(10);
    pdf.text(url, centerX, 135, { align: 'center' });

    pdf.save(`qr-${artifact.titleNL}.pdf`);
}



async function loadPngAsDataUrl(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


export async function downloadBatchQrPdf(artifacts: Artifact[]) {
    if (!artifacts.length) return;

    const logoDataUrl = await loadPngAsDataUrl('/logo.png');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    for (let i = 0; i < artifacts.length; i++) {
        const artifact = artifacts[i];
        if (!artifact.id) continue;

        if (i > 0) pdf.addPage();

        const url = `${location.origin}/artifact/${artifact.id}`;

        const qrDataUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'H'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        pdf.setFontSize(18);
        pdf.text(artifact.titleNL, centerX, 30, { align: 'center' });

        pdf.addImage(qrDataUrl, 'PNG', centerX - 40, 45, 80, 80);

        pdf.setFillColor(255, 255, 255);
        pdf.circle(centerX, 85, 10, 'F');
        pdf.addImage(logoDataUrl, 'PNG', centerX - 7, 78, 14, 14);

        pdf.setFontSize(10);
        pdf.text(url, centerX, 135, { align: 'center' });
    }

    pdf.save(`qr-codes-${artifacts.length}.pdf`);
}
