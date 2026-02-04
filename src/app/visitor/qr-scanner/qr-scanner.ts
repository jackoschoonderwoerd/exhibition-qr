import {
    Component,
    OnDestroy,
    AfterViewInit,
    inject,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
    standalone: true,
    imports: [MatButtonModule],
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.html',
    styleUrls: ['./qr-scanner.scss'],

})
export class QrScanner implements AfterViewInit, OnDestroy {
    private router = inject(Router);
    private scanner?: Html5Qrcode;

    error = signal<string | null>(null);
    private scanned = false;

    async start() {
        try {
            this.scanner = new Html5Qrcode('qr-reader');

            if (!this.scanner) {
                alert('no scanner')
                this.error.set(
                    'Camera not available. Try reopening the app or use Safari.'
                );
            } else {
                alert('scanner present')
            }

            await this.scanner.start(
                { facingMode: 'environment' }, // fallback below if needed
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                text => this.onScan(text),
                () => { }
            );
        } catch (err) {
            console.error(err);
            this.error.set('Camera access denied or unavailable');
        }
    }

    async ngAfterViewInit() {
        // try {
        //     this.scanner = new Html5Qrcode('qr-reader');

        //     await this.scanner.start(
        //         { facingMode: 'environment' },
        //         {
        //             fps: 10,
        //             qrbox: { width: 250, height: 250 },
        //         },
        //         text => this.onScan(text),
        //         () => { }
        //     );
        // } catch {
        //     this.error.set('Camera access denied or unavailable');
        // }
    }

    async onScan(text: string) {
        if (this.scanned) return;
        this.scanned = true;

        navigator.vibrate?.(150);

        await this.stop();

        const artifactId = this.extractArtifactId(text);

        if (!artifactId) {
            this.error.set('Invalid QR code');
            return;
        }

        this.router.navigate(['/artifact', artifactId]);
    }

    extractArtifactId(value: string): string | null {
        try {
            const url = new URL(value);
            const parts = url.pathname.split('/');
            return parts.at(-1) ?? null;
        } catch {
            return value || null;
        }
    }

    async stop() {
        if (this.scanner && this.scanner.isScanning) {
            await this.scanner.stop();
            await this.scanner.clear();
        }
    }

    ngOnDestroy() {
        this.stop();
    }
}
