import {
  Component,
  output,
  signal,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FoodEntry } from '../../models/entries';
import { NutritionAnalysisService } from '../../services/nutrition-analysis.service';

@Component({
  selector: 'app-food-capture',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="food-capture-card">
      <mat-card-header>
        <mat-card-title>🍽️ Essen erfassen</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <!-- Mode Selection -->
        <div class="mode-selector">
          <mat-button-toggle-group
            [(value)]="mode"
            (change)="mode = $event.value"
            appearance="standard"
          >
            <mat-button-toggle value="camera">
              <mat-icon>camera_alt</mat-icon>
              Foto
            </mat-button-toggle>
            <mat-button-toggle value="upload">
              <mat-icon>image</mat-icon>
              Upload
            </mat-button-toggle>
            <mat-button-toggle value="manual">
              <mat-icon>edit</mat-icon>
              Manuell
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <!-- Camera Mode -->
        @if (mode === 'camera') {
          <div class="camera-section">
            <video
              #videoElement
              autoplay
              playsinline
              class="video-feed"
            ></video>
            <div class="button-group">
              <button
                mat-raised-button
                color="primary"
                (click)="startCamera()"
                [disabled]="cameraActive()"
              >
                <mat-icon>videocam</mat-icon>
                Kamera starten
              </button>
              <button
                mat-raised-button
                color="accent"
                (click)="capturePhoto()"
                [disabled]="!cameraActive()"
              >
                <mat-icon>photo_camera</mat-icon>
                Foto machen
              </button>
              <button
                mat-raised-button
                (click)="stopCamera()"
                [disabled]="!cameraActive()"
              >
                <mat-icon>videocam_off</mat-icon>
                Kamera stoppen
              </button>
            </div>
          </div>
        }

        <!-- Upload Mode -->
        @if (mode === 'upload') {
          <div class="upload-section">
            <input
              #fileInput
              type="file"
              accept="image/*"
              (change)="handleFileUpload($event)"
              style="display: none"
            />
            <button
              mat-raised-button
              color="primary"
              (click)="fileInput.click()"
            >
              <mat-icon>cloud_upload</mat-icon>
              Bild hochladen
            </button>
          </div>
        }

        <!-- Manual Entry Mode -->
        @if (mode === 'manual') {
          <div class="manual-entry-section">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Lebensmittel / Gericht</mat-label>
              <input
                matInput
                [(ngModel)]="foodName"
                placeholder="z.B. Hähnchenbrust mit Reis"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Menge</mat-label>
              <input
                matInput
                [(ngModel)]="foodQuantity"
                placeholder="z.B. 150g, 1 Portion"
              />
            </mat-form-field>
          </div>
        }

        <!-- Preview & Nutrition Analysis -->
        @if (capturedImage() || uploadedImage() || mode === 'manual') {
          <div class="preview-section">
            @if (capturedImage() || uploadedImage()) {
              <img
                [src]="capturedImage() || uploadedImage()"
                alt="Vorschau"
                class="preview-image"
              />
            }

            <div class="button-group">
              <button
                mat-raised-button
                color="primary"
                (click)="analyzeFood()"
                [disabled]="
                  isAnalyzing() ||
                  (!capturedImage() && !uploadedImage() && mode !== 'manual')
                "
              >
                @if (isAnalyzing()) {
                  <mat-spinner
                    diameter="20"
                    strokeWidth="2"
                  ></mat-spinner>
                } @else {
                  <ng-container>
                    <mat-icon>search</mat-icon>
                    Analysieren
                  </ng-container>
                }
              </button>
              <button
                mat-raised-button
                (click)="resetCapture()"
                [disabled]="isAnalyzing()"
              >
                <mat-icon>close</mat-icon>
                Zurücksetzen
              </button>
            </div>

            <!-- Nutrition Analysis Result -->
            @if (nutrition(); as nut) {
              <mat-card class="nutrition-preview-card">
                <mat-card-header>
                  <mat-card-title>📊 Geschätzte Nährwerte</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <span class="nutrition-label">Kalorien</span>
                      <span class="nutrition-value">{{ nut.calories }}</span>
                      <span class="nutrition-unit">kcal</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Protein</span>
                      <span class="nutrition-value">{{ nut.protein }}</span>
                      <span class="nutrition-unit">g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Kohlenhydrate</span>
                      <span class="nutrition-value">{{ nut.carbs }}</span>
                      <span class="nutrition-unit">g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="nutrition-label">Fett</span>
                      <span class="nutrition-value">{{ nut.fat }}</span>
                      <span class="nutrition-unit">g</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            }

            <!-- Description -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notizen</mat-label>
              <textarea
                matInput
                [(ngModel)]="description"
                placeholder="Zusätzliche Informationen zum Essen..."
                rows="3"
              ></textarea>
            </mat-form-field>

            <!-- Save Button -->
            <button
              mat-raised-button
              color="primary"
              (click)="saveFoodEntry()"
              [disabled]="!canSave()"
              class="save-button"
            >
              <mat-icon>save</mat-icon>
              Eintrag speichern
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .food-capture-card {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      mat-card-title {
        font-size: 24px;
        margin: 0;
        color: #333;
      }
    }

    mat-card-content {
      padding: 20px 0;
    }

    .mode-selector {
      margin-bottom: 24px;
      display: flex;
      justify-content: center;

      mat-button-toggle-group {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      mat-button-toggle {
        flex: 1;
      }
    }

    .camera-section,
    .upload-section,
    .manual-entry-section {
      margin-bottom: 20px;
    }

    .video-feed {
      width: 100%;
      max-height: 400px;
      border-radius: 8px;
      margin-bottom: 16px;
      background: #f5f5f5;
      object-fit: cover;
    }

    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;

      button {
        flex: 1;
        min-width: 120px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .preview-section {
      margin-top: 24px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .preview-image {
      width: 100%;
      max-height: 300px;
      border-radius: 8px;
      margin-bottom: 16px;
      object-fit: cover;
    }

    .nutrition-preview-card {
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      mat-card-header {
        margin-bottom: 12px;

        mat-card-title {
          font-size: 18px;
        }
      }

      mat-card-content {
        padding: 16px 0;
      }
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
    }

    .nutrition-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border-left: 4px solid #667eea;

      .nutrition-label {
        font-size: 12px;
        color: #666;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .nutrition-value {
        font-size: 20px;
        font-weight: 700;
        color: #333;
      }

      .nutrition-unit {
        font-size: 11px;
        color: #999;
        margin-top: 2px;
      }
    }

    .save-button {
      width: 100%;
      margin-top: 20px;
      padding: 12px;
      font-size: 16px;
    }

    textarea {
      resize: vertical;
    }

    @media (max-width: 600px) {
      .food-capture-card {
        padding: 12px;
      }

      .mode-selector mat-button-toggle-group {
        flex-direction: column;
      }

      .button-group button {
        min-width: 100px;
        font-size: 12px;
      }

      .nutrition-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      mat-card-header mat-card-title {
        font-size: 20px;
      }
    }
  `,
})
export class FoodCaptureComponent {
  private nutritionService = inject(NutritionAnalysisService);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  mode: 'camera' | 'upload' | 'manual' = 'camera';
  cameraActive = signal(false);
  capturedImage = signal<string | null>(null);
  uploadedImage = signal<string | null>(null);
  nutrition = signal<any>(null);
  isAnalyzing = signal(false);
  foodName = '';
  foodQuantity = '';
  description = '';

  foodEntryCreated = output<FoodEntry>();

  canSave() {
    if (this.mode === 'manual') {
      return this.foodName.trim().length > 0;
    }
    return (this.capturedImage() || this.uploadedImage()) && !this.isAnalyzing();
  }

  async startCamera(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
        this.cameraActive.set(true);
      }
    } catch (error) {
      console.error('Kamerafehler:', error);
      alert('Kamera konnte nicht gestartet werden');
    }
  }

  capturePhoto(): void {
    if (!this.videoElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      this.capturedImage.set(canvas.toDataURL('image/jpeg'));
      this.nutrition.set(null);
    }
  }

  stopCamera(): void {
    if (this.videoElement) {
      const stream = this.videoElement.nativeElement
        .srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      this.cameraActive.set(false);
    }
  }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage.set(e.target?.result as string);
        this.nutrition.set(null);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async analyzeFood(): Promise<void> {
    this.isAnalyzing.set(true);

    try {
      const imageUrl = this.capturedImage() || this.uploadedImage();

      if (imageUrl && this.mode !== 'manual') {
        const result = await this.nutritionService.analyzeFoodImage(imageUrl);
        this.nutrition.set(result);
      } else if (this.mode === 'manual' && this.foodName) {
        const result = await this.nutritionService.analyzeFoodImage(
          this.foodName
        );
        this.nutrition.set(result);
      }
    } catch (error) {
      console.error('Analysefehler:', error);
      alert('Analyse konnte nicht durchgeführt werden');
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  saveFoodEntry(): void {
    const entry: FoodEntry = {
      id: Date.now().toString(),
      type: 'food',
      timestamp: new Date(),
      imageUrl: this.capturedImage() || this.uploadedImage() || undefined,
      description: this.description || `${this.foodName} ${this.foodQuantity}`,
      nutrition: this.nutrition() || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    };

    this.foodEntryCreated.emit(entry);
    this.resetCapture();
  }

  resetCapture(): void {
    this.stopCamera();
    this.capturedImage.set(null);
    this.uploadedImage.set(null);
    this.nutrition.set(null);
    this.foodName = '';
    this.foodQuantity = '';
    this.description = '';
  }
}
