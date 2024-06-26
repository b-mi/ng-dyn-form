import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { JsonPipe, NgClass } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule, FormControl } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipGrid, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSliderModule } from '@angular/material/slider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormFlowControlEditorComponent } from './form-flow-control-editor.component';
import { ConfigService } from '../config.service';
import { Observable, count, debounceTime, distinctUntilChanged, filter, lastValueFrom, map, of, startWith, switchMap, tap } from 'rxjs';
import { FormFlowService } from './form-flow.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-form-flow-content',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, NgClass, MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatCardModule, MatDatepickerModule, MatChipsModule, MatButtonToggleModule, AsyncPipe,
    MatTooltipModule, JsonPipe, MatSnackBarModule, MatRadioModule, MatAutocompleteModule,
    FormFlowControlEditorComponent, FormsModule, OverlayModule, MatDividerModule,
    MatAutocompleteModule, AsyncPipe, MatSliderModule

  ],
  templateUrl: './form-flow-content.component.html',
  styleUrl: './form-flow-content.component.css'
})
export class FormFlowContentComponent implements OnInit {

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement> | undefined;
  filteredOptions: { [key: string]: Observable<any> | undefined } = {};

  // private http = inject(HttpClient);
  // private snack = inject(MatSnackBar);


  protected config = inject(ConfigService);

  private fservice = inject(FormFlowService);

  protected editMode: boolean = false;

  // if property editor is open
  isEditorOpened = false;

  // actual control in edit mode
  editedControl: any = null;


  // formGroup
  private _form!: FormGroup;
  public get formGroup(): FormGroup {
    return this._form;
  }
  @Input()
  public set formGroup(v: FormGroup) {
    this._form = v;

  }


  // control list
  private _controls!: any[];
  public get controls(): any[] {
    return this._controls;
  }
  @Input()
  public set controls(v: any[]) {
    this._controls = v;
  }


  // form identifier, part of file name
  private _formId!: string;
  @Input()
  public get formId(): string {
    return this._formId;
  }

  public set formId(v: string) {
    this._formId = v;
  }


  private _allowEditMode: boolean = false;
  @Input()
  public get allowEditMode(): boolean {
    return this._allowEditMode;
  }
  public set allowEditMode(v: boolean) {
    this._allowEditMode = v;
  }


  private _appearance: MatFormFieldAppearance = 'fill'; // fill, outline;
  @Input()
  public get appearance(): MatFormFieldAppearance {
    return this._appearance;
  }
  public set appearance(v: MatFormFieldAppearance) {
    this._appearance = v;
  }



  chipSeparatorKeysCodes: number[] = [ENTER, COMMA];

  ngOnInit() {

    this.controls.forEach(ctl => {
      if (ctl.api) {

        this.filteredOptions[ctl.name] = this.formGroup.get(ctl.name)?.valueChanges.pipe(
          distinctUntilChanged(),
          debounceTime(1000),
          startWith(''),
          // tap(value => console.log('tap', value, ctl)),
          filter(value => typeof value === 'string' || !value), // disable calling getApiValues after selecting from combo list. It prevets filtering to selected value. for chips and autocomplete
          switchMap(value => {
            let strFlt = value;
            if (!value)
              strFlt = '-';

            return this.fservice.getApiValues(ctl.api, strFlt);
          })
        );
      }
    });

  }


  editCtrl(ctl: any) {
    if (!this.isEditorOpened) {
      this.editedControl = ctl;
      this.isEditorOpened = true;
    }
  }

  move(ctl: any, cmd: string) {

    const idx = this.controls.indexOf(ctl);

    switch (cmd) {
      case 'left':
        if (idx > 0) {
          this.moveItem(this.controls, idx, idx - 1);
        }
        break;
      case 'smaller':
        this.changeSize(ctl, -1);
        break;
      case 'bigger':
        this.changeSize(ctl, 1);
        break;
      case 'right':
        if (idx < this.controls.length - 1) {
          this.moveItem(this.controls, idx, idx + 1);
        }
        break;

    }
  }
  changeSize(ctl: any, par: number) {

    const sizes: string[] = [
      'quarter',
      'third',
      'half',
      'two-thirds',
      'three-quarters',
      'full'
    ];

    const idx = sizes.indexOf(ctl.flex);
    if (par === -1) {
      //smaller
      if (idx > 0) {
        ctl.flex = sizes[idx - 1];
      }
    } else {
      // bigger
      if (idx < sizes.length - 1) {
        ctl.flex = sizes[idx + 1];
      }

    }

  }

  moveItem(data: any[], from: number, to: number) {
    // remove `from` item and store it
    var f = data.splice(from, 1)[0];
    // insert stored item into position `to`
    data.splice(to, 0, f);
  }

  closeEditOverlay(event: any) {
    this.isEditorOpened = false;
    if (event.doSave) {
      const idx = this.controls.findIndex((i) => i.name === event.data.name);
      this.controls[idx] = event.data;
      this.editedControl = undefined;

    }
  }


  async saveToFile() {
    await this.fservice.saveToFile(this.formId, this.controls);
    location.reload();
  }


  displayFn(item: any): string {
    return item && item.label ? item.label : '';
  }

  addNewCtl() {
    if (this.editMode && this.editedControl) {

      const index = this.controls.indexOf(this.editedControl);
      if (index > 0) {
        const newCtl: any = {
          type: 'text',
          label: 'New Control',
          name: 'new_control',
          flex: 'quarter',
          value: null,
          isRequired: false,
        };
        this.controls.splice(index + 1, 0, newCtl);

        this.editedControl = newCtl;
      }
    }
  }
  removeSelectedCtl() {
    if (this.editMode && this.editedControl) {
      const index = this.controls.indexOf(this.editedControl);
      if (index > -1) {
        this.editedControl = null;
        this.controls.splice(index, 1);
      }
    }
  }


  chipRemove(ctl: any, item: any) {

    const arr = <any[]>ctl.values;
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
      const fc = this.formGroup.get(ctl.name);
      fc?.setValue(arr);

    }

  }

  chipAdd(event: MatChipInputEvent, ctl: any) {
    // disable adding value entered from keyboard
  }

  chipSelected(event: MatAutocompleteSelectedEvent, ctl: any, inp: HTMLInputElement) {

    if (!ctl.values)
      ctl.values = [];
    ctl.values.push(event.option.value);
    inp.value = '';
    const fc = this.formGroup.get(ctl.name) as FormControl;
    fc.setValue(ctl.values);
  }




  openApiList(trigger: MatAutocompleteTrigger, name: string) {

    if (trigger.panelOpen) {
      trigger.closePanel()
    } else {
      trigger.openPanel()
    }
  }

  chipClearApiInput(ctl: any, inp: HTMLInputElement, trigger: MatAutocompleteTrigger, chipGrid: MatChipGrid) {
    // nefunguje to dobre
    inp.value = '';
    //const fc = this.formGroup.get(ctl.name) as FormControl;
    chipGrid.valueChange.emit('');
    //chipGrid.valueChange.next('');
  }

  acClearApiInput(ctl: any, inp: HTMLInputElement) {
    inp.value = '';
    const fc = this.formGroup.get(ctl.name) as FormControl;
    fc.setValue(null);

  }

  chipLostFocus(ctl: any, inp: HTMLInputElement) {
    inp.value = '';
    const fc = this.formGroup.get(ctl.name) as FormControl;
    fc.setValue(ctl.values);
  }

  acLostFocus(ctl: any, inp: HTMLInputElement) {
    const fc = this.formGroup.get(ctl.name) as FormControl;
    if (typeof fc.value === 'string') {
      fc.setValue(null);
    }
  }



}
