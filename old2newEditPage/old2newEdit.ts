let str = `<div class="modal-wrapper" *ngIf="dataIsAvailable">
  <jhi-alert></jhi-alert>
  <div class="flex gap-3 items-center p-3">
    <h6
      *ngIf="!role.id"
      class="modal-title"
      id="myRoleLabel"
      jhiTranslate="encoreclientApp.role.create.title"
    >
      Create a new Role
    </h6>
    <h6
      *ngIf="role.id"
      class="modal-title"
      id="editRoleLabel"
      jhiTranslate="encoreclientApp.role.edit.title"
    >
      Edit Role
    </h6>
    <div class="flex ml-auto gap-3">
      <button
        [disabled]="editForm.form.invalid"
        jhiTranslate="entity.action.save"
        class="btn-dark-blue"
        (click)="save()"
      >
        {{ isEdit ? "Update" : "Save" }}
      </button>
      <button class="btn-icon-blue" (click)="close.emit('')">
        <span class="material-icons">close</span>
      </button>
    </div>
  </div>
  <div>&nbsp;</div>
  <form
    name="editForm"
    role="form"
    novalidate
    (ngSubmit)="save()"
    #editForm="ngForm"
  >
    <div class="px-2 py-4 w-full h-full absolute overflow-auto">
      <div class="layout">
        <div class="field">
          <label
            class="label"
            jhiTranslate="encoreclientApp.role.roleCode"
            for="field_roleCode"
            >Role Code</label
          >
          <input
            type="text"
            class="input"
            name="roleCode"
            id="field_roleCode"
            [(ngModel)]="role.roleCode"
            required
            [readonly]="isEdit"
          />
          <ig-input
            [inputField]="editForm.controls.roleCode"
            [inputErrors]="editForm.controls.roleValue?.errors"
          >
          </ig-input>
        </div>
        <div class="field">
          <label
            class="label"
            jhiTranslate="encoreclientApp.role.roleName"
            for="field_roleName"
            >Role Name</label
          >
          <input
            type="text"
            class="input"
            name="roleName"
            id="field_roleName"
            [(ngModel)]="role.roleName"
          />
          <ig-input
            [inputField]="editForm.controls.roleName"
            [inputErrors]="editForm.controls.roleValue?.errors"
          >
          </ig-input>
        </div>
        <div class="field">
          <label
            class="label"
            jhiTranslate="encoreclientApp.role.description"
            for="field_description"
            >Description</label
          >
          <input
            type="text"
            class="input"
            name="description"
            id="field_description"
            [(ngModel)]="role.description"
            required
          />
          <ig-input
            [inputField]="editForm.controls.description"
            [inputErrors]="editForm.controls.roleValue?.errors"
          ></ig-input>
        </div>
        <div class="field">
          <label
            class="label"
            jhiTranslate="encoreclientApp.role.authorities"
            for="field_authorities"
            >Authorities</label
          >
          <ss-multiselect-dropdown
            name="dropList"
            [options]="authorityList"
            [(ngModel)]="optionsModel"
            [settings]="mySettings"
            class="input p-0"
          ></ss-multiselect-dropdown>
          <ig-input
            [inputField]="editForm.controls.authorities"
            [inputErrors]="editForm.controls.authorities?.errors"
          ></ig-input>
        </div>
      </div>
    </div>
  </form>
</div>`
let lim = `<div class="card-body">
<jhi-alert></jhi-alert>
<div class="row">
    <div class="col-8">
        <h6 *ngIf="!limit || !limit.id" class="modal-title" id="collateralLabel"
            jhiTranslate="encoreclientApp.limits.create.title">Create a new
            limit</h6>
        <h6 *ngIf="limit.id" class="modal-title" id="editCollateralSettingLabel"
            jhiTranslate="encoreclientApp.limits.edit.title">Edit limit
        </h6>
    </div>
</div>
<div>&nbsp;</div>
<div>
    <form #editForm="ngForm" name="editForm" novalidate (ngSubmit)="save(editForm)">
        <div>
            <div class="reactiveForm">
                <div class="row mb-3 d-flex align-items-center">
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.customerId"
                            for="field_customerId">Customer Id</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <input type="text" class="form-control" name="customerId" id="field_customerId"
                            [(ngModel)]="limit.customerId" readonly required />
                        <ig-input [inputField]="editForm.controls.customerId"
                            [inputErrors]="editForm.controls.customerId?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.code"
                            for="field_code">Code</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <input type="text" class="form-control" name="code" id="field_code" [(ngModel)]="limit.code"
                            [readonly]="isEdit">
                        <ig-input [inputField]="editForm.controls.code"
                            [inputErrors]="editForm.controls.code?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.description"
                            for="field_description">Description</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <input type="text" class="form-control" name="description" id="field_description"
                            [(ngModel)]="limit.description" />
                        <ig-input [inputField]="editForm.controls.description"
                            [inputErrors]="editForm.controls.description?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div *ngIf="!limit || !limit.id" class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.currencyCode"
                            for="field_currencyCode">CurrencyCode</label>
                        <span> : </span>
                    </div>
                    <div *ngIf="!limit || !limit.id" class="col-2 p-0">
                        <select *ngIf="!limit || !limit.id" class="form-control" name="currencyCode"
                            id="field_currencyCode" [(ngModel)]="limit.currencyCode" required>
                            <option selected [ngValue]="defaultValue1">--Select--</option>
                            <option *ngFor="let currency of currenciesList" [ngValue]="currency.currencyCode">
                                {{currency.displayCurrencyName}}
                            </option>
                        </select>
                        <ig-input [inputField]="editForm.controls.currencyCode"
                            [inputErrors]="editForm.controls.currencyCode?.errors"></ig-input>
                    </div>
                    <div class="col-7" *ngIf="!limit || !limit.id"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.amount"
                            for="field_amount">Amount</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <input type="text" class="form-control" name="limitAmount" id="field_amount"
                            [(ngModel)]="limit.amount.magnitude" required />
                        <ig-input [inputField]="editForm.controls.limitAmount"
                            [inputErrors]="editForm.controls.limitAmount?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.limitType"
                            for="field_limitType">Limit Type</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <select class="form-control" name="limitType" id="field_limitType"
                            [(ngModel)]="limit.limitType" required>
                            <option selected [ngValue]="defaultValue1">--Select--</option>
                            <option *ngFor="let limitsType of limitTypeArr" [ngValue]="limitsType.code">
                                {{limitsType.name}}
                            </option>
                        </select>
                        <ig-input [inputField]="editForm.controls.limitType"
                            [inputErrors]="editForm.controls.limitType?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.collateralCode"
                            for="field_collateralCode">Collateral Code</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <!-- <input type="text" class="form-control" name="collateralCode" id="field_collateralCode"
                            [(ngModel)]="limit.collateralCode" />
                        <ig-input [inputField]="editForm.controls.collateralCode"
                            [inputErrors]="editForm.controls.collateralCode?.errors"></ig-input> -->
                        <select class="form-control" name="collateralCode" id="field_collateralCode"
                            [(ngModel)]="limit.collateralCode">
                            <option selected [ngValue]="defaultValue1">--Select--</option>
                            <option *ngFor="let collateralCode of collateralCodeArr"
                                [ngValue]="collateralCode.code">
                                {{collateralCode.name}}
                            </option>
                        </select>
                        <ig-input [inputField]="editForm.controls.collateralCode"
                            [inputErrors]="editForm.controls.collateralCode?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.effectiveDate"
                            for="field_effectiveDate">Effective Date</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <div class="input-group">
                            <input type="text" class="form-control" name="effectiveDate" id="field_effectiveDate"
                                [(ngModel)]="limit.effectiveDate" ngbDatepicker #effectiveDateDp="ngbDatepicker"
                                placeholder="yyyy-mm-dd" required />
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default datepicker-border"
                                    (click)="effectiveDateDp.toggle()">
                                    <i class="fa fa-calendar"></i>
                                </button>
                            </span>
                        </div>
                        <ig-input [inputField]="editForm.controls.effectiveDate"
                            [inputErrors]="editForm.controls.effectiveDate?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                    <div class="text-right text-right form-group col-3">
                        <label class="form-control-label" jhiTranslate="encoreclientApp.limits.expiryDate"
                            for="field_expiryDate">Expiry Date</label>
                        <span> : </span>
                    </div>
                    <div class="col-2 p-0">
                        <div class="input-group">
                            <input type="text" class="form-control" name="expiryDate" id="field_expiryDate"
                                [(ngModel)]="limit.expiryDate" ngbDatepicker #expiryDateDp="ngbDatepicker"
                                placeholder="yyyy-mm-dd" required />
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default datepicker-border"
                                    (click)="expiryDateDp.toggle()">
                                    <i class="fa fa-calendar"></i>
                                </button>
                            </span>
                        </div>
                        <ig-input [inputField]="editForm.controls.expiryDate"
                            [inputErrors]="editForm.controls.expiryDate?.errors"></ig-input>
                    </div>
                    <div class="col-7"></div>
                </div>
            </div>
        </div>
        <div>
            <button type="button" class="btn btn-default" (click)="clear()">
                <span jhiTranslate="entity.action.cancel">Cancel</span>
            </button>
            <span [ngbTooltip]="editForm.invalid ? 'Form Invalid!' : null">
                <button type="submit" [disabled]="editForm.invalid" class="btn btn-info ml-2">
                    <span jhiTranslate="entity.action.save">Save</span>
                </button>
            </span>
        </div>
    </form>
</div>
</div>`