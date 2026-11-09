import {
  Component,
  output,
  signal,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodEntry } from '../../models/entries';
import { NutritionAnalysisService } from '../../services/nutrition-analysis.service';

@Component({
  selector: 'app-food-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="food-capture">
      <h2>🍽️ Essen</h2>

      <div class="capture-modes">
        <button
          [class.active]="mode() === 'camera'"
          (click)="setMode('camera')"
          class="mode-btn"
        >
          📷 Kamera
        </button>
        <button
          [class.active]="mode() === 'upload'"
          (click)="setMode('upload')"
          class="mode-btn"
        >
          📁 Datei
        </button>
        <button
          [class.active]="mode() === 'manual'"
          (click)="setMode('manual')"
          class="mode-btn"
        >
          ✏️ Manuell
        </button>
      </div>

      <!-- Camera Mode -->
      <div *ngIf="mode() === 'camera'" class="capture-section">
        <video
          #videoElement
          class="video-preview"
          autoplay
          playsinline
        ></video>
        <div class="button-group">
          <button (click)="initCamera()" class="btn btn-primary">
            Kamera starten
          </button>
          <button
            *ngIf="cameraActive()"
            (click)="capturePhoto()"
            class="btn btn-success"
          >
            📷 Foto aufnehmen
          </button>
          <button
            *ngIf="cameraActive()"
            (click)="stopCamera()"
            class="btn btn-secondary"
          >
            Stoppen
          </button>
        </div>
      </div>

      <!-- Upload Mode -->
      <div *ngIf="mode() === 'upload'" class="capture-section">
        <input
          #fileInput
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          class="file-input"
        />
        <label for="fileInput" class="file-label">
          📁 Wählen Sie ein Bild aus
        </label>
      </div>

      <!-- Photo Preview & Description -->
      <div *ngIf="capturedImage()" class="preview-section">
        <img [src]="capturedImage()" class="preview-image" />

        <div class="description-form">
          <label>
            Beschreibung (optional):
            <input
              v-model="description"
              [(ngModel)]="description"
              type="text"
              placeholder="z.B. Salat mit Hühnchen"
              class="input-field"
            />
          </label>

          <div class="button-group">
            <button
              (click)="analyze()"
              [disabled]="isAnalyzing()"
              class="btn btn-primary"
            >
              {{ isAnalyzing() ? 'Analysiere...' : '🤖 Mit KI analysieren' }}
            </button>
            <button
              (click)="submitFood()"
              [disabled]="isAnalyzing()"
              class="btn btn-success"
            >
              {{ isAnalyzing() ? 'Bitte warten...' : '✅ Speichern' }}
            </button>
            <button (click)="clearCapture()" class="btn btn-secondary">
              ❌ Verwerfen
            </button>
          </div>
        </div>

        <div *ngIf="nutrition()" class="nutrition-preview">
          <h3>Geschätzte Nährwerte</h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="label">Kalorien</div>
              <div class="value">{{ nutrition().calories }} kcal</div>
            </div>
            <div class="nutrition-item">
              <div class="label">Protein</div>
              <div class="value">{{ nutrition().protein }}g</div>
            </div>
            <div class="nutrition-item">
              <div class="label">Kohlenhydrate</div>
              <div class="value">{{ nutrition().carbs }}g</div>
            </div>
            <div class="nutrition-item">
              <div class="label">Fett</div>
              <div class="value">{{ nutrition().fat }}g</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Entry -->
      <div *ngIf="mode() === 'manual'" class="manual-section">
        <label>
          Beschreibung:
          <input
            [(ngModel)]="description"
            type="text"
            placeholder="Was haben Sie gegessen?"
            class="input-field"
          />
        </label>

        <button
          (click)="submitFood()"
          [disabled]="!description.trim()"
          class="btn btn-success"
        >
          ✅ Speichern
        </button>
      </div>
    </div>
  `,
  styles: `
    .food-capture {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: #fafafa;

      h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: #333;
      }
    }

    .capture-modes {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      .mode-btn {
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;

        &:hover {
          border-color: #4CAF50;
          background: #f0f0f0;
        }

        &.active {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
      }
    }

    .capture-section,
    .manual-section {
      margin-bottom: 16px;
    }

    .video-preview {
      width: 100%;
      max-height: 300px;
      background: #000;
      border-radius: 4px;
      margin-bottom: 12px;
      display: block;
    }

    .file-input {
      display: none;
    }

    .file-label {
      display: block;
      padding: 20px;
      border: 2px dashed #4CAF50;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;

      &:hover {
        background: #f0f8f0;
      }
    }

    .preview-section {
      margin-top: 16px;
    }

    .preview-image {
      width: 100%;
      max-height: 300px;
      border-radius: 4px;
      margin-bottom: 16px;
      display: block;
    }

    .description-form {
      margin-bottom: 16px;

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .input-field {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
      }
    }

    .button-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .btn {
        flex: 1;
        min-width: 100px;
      }
    }

    .nutrition-preview {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
      margin-top: 16px;

      h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #666;
      }

      .nutrition-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .nutrition-item {
        background: #f9f9f9;
        padding: 12px;
        border-radius: 4px;
        text-align: center;

        .label {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
          color: #4CAF50;
        }
      }
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.btn-primary {
        background: #2196F3;
        color: white;

        &:hover:not(:disabled) {
          background: #1976D2;
        }
      }

      &.btn-success {
        background: #4CAF50;
        color: white;

        &:hover:not(:disabled) {
          background: #45a049;
        }
      }

      &.btn-secondary {
        background: #f44336;
        color: white;

        &:hover:not(:disabled) {
          background: #da190b;
        }
      }
    }

    @media (max-width: 600px) {
      .button-group {
        flex-direction: column;

        .btn {
          width: 100%;
        }
      }

      .nutrition-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class FoodCaptureComponent {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  private nutritionService = inject(NutritionAnalysisService);

  foodCaptured = output<Omit<FoodEntry, 'id'>>();

  mode = signal<'camera' | 'upload' | 'manual'>('camera');
  cameraActive = signal(false);
  capturedImage = signal<string | null>(null);
  description = '';
  isAnalyzing = signal(false);
  nutrition = signal<any>(null);

  private stream: MediaStream | null = null;

  async initCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.cameraActive.set(true);
      }
    } catch (error) {
      console.error('Fehler beim Zugriff auf Kamera:', error);
      alert('Kamerazugriff verweigert');
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.cameraActive.set(false);
    }
  }

  capturePhoto(): void {
    if (!this.videoElement) return;

    const canvas = document.createElement('canvas');
    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      this.capturedImage.set(canvas.toDataURL('image/jpeg'));
      this.stopCamera();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      this.capturedImage.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async analyze(): Promise<void> {
    if (!this.capturedImage()) return;

    this.isAnalyzing.set(true);
    try {
      const result = await this.nutritionService.analyzeFoodImage(
        this.capturedImage()!
      );

      this.description = result.description;
      this.nutrition.set(result.nutrition);
    } catch (error) {
      console.error('Fehler bei der Analyse:', error);
      alert('Analyse fehlgeschlagen');
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  submitFood(): void {
    const entry: Omit<FoodEntry, 'id'> = {
      type: 'food',
      timestamp: new Date(),
      description: this.description,
      imageUrl: this.capturedImage() || undefined,
      nutrition: this.nutrition() || undefined,
    };

    this.foodCaptured.emit(entry);
    this.clearCapture();
  }

  clearCapture(): void {
    this.capturedImage.set(null);
    this.description = '';
    this.nutrition.set(null);
  }

  setMode(newMode: 'camera' | 'upload' | 'manual'): void {
    this.stopCamera();
    this.mode.set(newMode);
  }
}
