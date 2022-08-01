let jhiData;
$.ajax({
    url: "./assets/en.json",
    async: false,
    success: function (res) {
        jhiData = res;
    },
    error: function () {
        alert("An error was encountered.");
    },
});
let compareHtml = `<div class="card-body">
<jhi-alert></jhi-alert>
<div class="row">
    <div class="col-8">
        <h6 class="card-title" jhiTranslate="encoreclientApp.associates.home.heading">List All Associates</h6>
    </div>
    <div class="col-4 text-right mb-2">
        <button class="btn btn-info btn-sm create-country" (click)="createAssociate()"
            *jhiHasAnyAuthority="['ROLE_CreateCustomerAssociate']">
            <span jhiTranslate="encoreclientApp.associates.home.createLabel">
                New Associates
            </span>
        </button>
    </div>
</div>
<div class="card">
    <div class="card-body search-card-body">
        <form name="searchForm">
            <div class="row">
                <div class="col-2">
                    <input type="text" class="form-control h-100" name="customerId" id="currentSearch.customerId"
                        placeholder="Customer Id" [(ngModel)]="currentSearch.customerId">
                </div>
                <div class="col-2">
                  <select class="form-control h-100" name="associateType" id="field_associateType"
                          [(ngModel)]="currentSearch.associateType">
                          <option selected value="">--Select Associate Type--</option>
                          <option *ngFor="let associateType of associateTypeList" [value]="associateType.code">
                              {{associateType.name}}
                          </option>
                      </select>
                </div>
                <div class="col-2">
                    <input type="text" class="form-control h-100" name="associateName" id="currentSearch.associateName"
                        placeholder="Associate Name" [(ngModel)]="currentSearch.name">
                </div>
                <div class="col-2">
                <input type="text" class="form-control h-100" name="associateName" id="currentSearch.associateName"
                    placeholder="Associate Name" formControlName="currentSearch.name">
            </div>
                <div class="col-2">
                    <button class="btn btn-info" (click)="search()">
                        <span class="fa fa-search"></span>
                    </button>
                    <button class="btn btn-info ml-2" (click)="clear()">
                        <span jhiTranslate="entity.action.clear">Clear</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
<br />
<div class="row">
    <div class="col-12">
        <table class="table table-bordereless table-striped table-sm mb-0">
            <thead class="bg-info">
                <tr>		
                    <th>
                        <span jhiTranslate="encoreclientApp.associates.associateName">Associate Name</span>
                        <span></span>
                    </th>
                    <th>
                        <span jhiTranslate="encoreclientApp.associates.customerId">CustomerID</span>
                        <span></span>
                    </th>
                    <th>
                        <span jhiTranslate="encoreclientApp.associates.associateType">Associate Type</span>
                        <span></span>
                    </th>
                    <th>
                        <span jhiTranslate="encoreclientApp.associates.effectiveDate">Effective Date</span>
                        <span></span>
                    </th>
                    <th>
                        <span jhiTranslate="encoreclientApp.associates.expiryDate">Expiry Date</span>
                        <span></span>
                    </th>
                    <th>
                        <span class="ml-5">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr *ngIf="!associates.length">
                    <td colspan="6" jhiTranslate="encoreclientApp.associates.home.noResultsFound">No Associates
                        found.</td>
                </tr>
                <tr *ngFor="let associate of associates ;trackBy: trackId">
                    <td>{{associate.displayName}}</td>
                    <td>{{associate.customerId}}</td>
                    <td>{{associate.associateType}}</td>
                    <td>{{associate.effectiveDate | date:'mediumDate'}}</td>
                    <td>{{associate.expiryDate | date:'mediumDate'}}</td>
                    <td>
                        <div>
                            <button type="submit" [routerLink]="['view', associate.id ]"
                                class="btn btn-link btn-sm">
                                <span class="hidden-md-down" jhiTranslate="entity.action.view"
                                    *jhiHasAnyAuthority="['ROLE_ShowCustomerAssociate']">View</span>
                            </button>
                            <button type="submit" [routerLink]="['edit', associate.id]" replaceUrl="true"
                                class="btn btn-link btn-sm">
                                <span class="hidden-md-down" jhiTranslate="entity.action.edit"
                                    *jhiHasAnyAuthority="['ROLE_UpdateCustomerAssociate']">Edit</span>
                            </button>
                            <button type="button" (click)="delete(associate.id)" replaceUrl="true"
                                class="btn btn-link btn-sm">
                                <span class="hidden-md-down" *jhiHasAnyAuthority="['ROLE_DeleteCustomerAssociate']" jhiTranslate="entity.action.delete">Delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div *ngIf="associates && associates.length > 0" class="card" style="background-color: #f8f9fa;">
            <div class="card-body p-0">
                <div class="d-flex flex-row-reverse">
                    <div class="p-2 text-center">
                        <div class="info jhi-item-count">
                            Showing
                            {{ (page - 1) * itemsPerPage == 0 ? 1 : (page - 1) * itemsPerPage + 1 }}
                            - {{ page * itemsPerPage < queryCount ? page * itemsPerPage : queryCount }} of {{
                                queryCount }} items. </div>
                                <ngb-pagination [collectionSize]="totalItems" [(page)]="page"
                                    class="align-items-center mt-2 d-flex justify-content-center"
                                    [pageSize]="itemsPerPage" (pageChange)="loadPage(page)"></ngb-pagination>
                        </div>
                        <div class="p-2">
                            <label style="font-weight: normal;" jhiTranslate="global.form.resultsPerPage"
                                for="field_resultsPerpage">Page
                                size</label>
                            <select class="form-control mt-2 defaultBorder" name="resultsPerpage"
                                id="resultsPerpage" [(ngModel)]="itemsPerPage" (ngModelChange)="transition()">
                                <option value="5" jhiTranslate="global.table.5">5</option>
                                <option value="10" jhiTranslate="global.table.10">10</option>
                                <option value="15" jhiTranslate="global.table.15">15</option>
                                <option value="20" jhiTranslate="global.table.20">20</option>
                                <option value="25" jhiTranslate="global.table.25">25</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
let htmlExtractTool = new HtmlTool();
let sH = new StringHelper();
const oHC = new ObjectHelperClass();
const htmlFormatter = new HtmlFormatter();
function wrapWithTag(value = "", _class = "", eAttr = "", tag = "div") {
    let nl = '\n';
    if (eAttr === "" && _class !== "")
        return `<${tag} class="${_class}" ${eAttr}>\n\t${value}\n</${tag}>`;
    return `<${tag} ${eAttr}>\n\t${value}\n</${tag}>`;
}
function genPageHeader(jhi) {
    let exJhiAttr = htmlExtractTool.extractAttribute(jhi, "jhiTranslate");
    let exJhiVal = htmlExtractTool.extractAttributeValue(exJhiAttr);
    return `<div ${jhi} class="page-head">
      ${oHC.getObjectValue(jhiData, exJhiVal)}
  </div>`;
}
function genPageHeaderButtons(compareHtml, showFilter) {
    let buttonDiv = htmlExtractTool.extractHtmlTag2(compareHtml, 'div', 'class="col-.*? text-right');
    let buttonsHtml = ` <button class="btn-light-blue" (click)="showFilters = !showFilters">
    {{ showFilters ? 'Hide ' : 'Show ' }} Filters
    <span class="material-icons text-lg align-middle leading-5 ml-1">filter_alt</span>
  </button>`;
    if (!showFilter)
        buttonsHtml = '';
    if (!buttonDiv && showFilter)
        return wrapWithTag(buttonsHtml, '', 'class="flex justify-end gap-3 items-center p-3"');
    if (!buttonDiv)
        return buttonsHtml;
    let buttons = htmlExtractTool.extractAllTagWithAttr(buttonDiv, 'button');
    for (let button of buttons) {
        button = htmlExtractTool.removeAttribute(button, 'class');
        button = htmlExtractTool.addAttribute(button, 'class="btn-dark-blue"');
        button = cleanSpanButton(button);
        buttonsHtml += button;
    }
    let wrapButton = wrapWithTag(buttonsHtml, '', 'class="flex justify-end gap-3 items-center p-3"');
    return wrapButton;
}
function genPageHeaderButtons2(compareHtml, showFilter) {
    let buttonDiv = htmlExtractTool.extractHtmlTag2(compareHtml, 'div', 'class="col-.*? text-right');
    let buttonsHtml = ``;
    if (!buttonDiv)
        return buttonsHtml;
    let buttons = htmlExtractTool.extractAllTagWithAttr(buttonDiv, 'button');
    buttons.forEach((button, index) => {
        button = htmlExtractTool.removeAttribute(button, 'class');
        if (index === 0) {
            button = htmlExtractTool.addAttribute(button, 'class="btn-light-blue"');
        }
        else {
            button = htmlExtractTool.addAttribute(button, 'class="btn-dark-blue"');
        }
        button = cleanSpanButton(button);
        buttonsHtml += button;
    });
    let wrapButton = wrapWithTag(buttonsHtml, '', 'class="flex gap-3"');
    return wrapButton;
}
// wrapWithTag("w-full",value)
// wrapWithTag("page-body",value)
// wrapWithTag("flex w-1/2 gap-2",value)
// wrapWithTag("flex justify-between items-center p-3",value)
// wrapWithTag("flex gap-3",value)
// wrapWithTag("p-3",value)
// wrapWithTag("paginator-container",value)
function indentAllLines(text, noOfIndentations = 1) {
    return text.replaceAll(/^/gm, '\t'.repeat(noOfIndentations));
}
let selectCount = 0, inputCount = 0;
function generateSearchForm(compareHtml) {
    selectCount = 0;
    inputCount = 0;
    let formTag = htmlExtractTool.extractHtmlTag(compareHtml, "form", "searchForm");
    if (!formTag)
        return '';
    let divs = htmlExtractTool.extractAllTagWithAttr(formTag, "div", "col-2");
    let attrArr = [];
    let html = ``;
    for (let div of divs) {
        let input = htmlExtractTool.extractHtmlTag(div, "(input)", "", true);
        let select = htmlExtractTool.extractHtmlTag(div, "select");
        if (!input && !select)
            continue;
        else if (input) {
            inputCount++;
            html += handleInput(input, 'i');
        }
        else if (select) {
            selectCount++;
            html += handleInput(select, 's');
        }
        else
            console.warn("something is different", input);
    }
    return html;
}
function genTheadRow(jhi) {
    let attrVal = htmlExtractTool.extractAttributeValue(jhi);
    return indentAllLines(`<th ${jhi}>${oHC.getObjectValue(jhiData, attrVal)}</th>\n`);
}
function genThRows(compareHtml) {
    let table = htmlExtractTool.extractHtmlTag(compareHtml, "table");
    let thead = htmlExtractTool.extractHtmlTag(table, "thead");
    let thRows = htmlExtractTool.extractAllTagWithAttr(thead, "th");
    let html = ``;
    for (let thRow of thRows) {
        let jhi = htmlExtractTool.extractAttribute(thRow, 'jhiTranslate');
        let ngIf = htmlExtractTool.extractAttribute(thRow, '\\*ngIf');
        if (jhi) {
            let eachRow = genTheadRow(jhi);
            if (ngIf) {
                htmlExtractTool.addAttribute(thRow, ngIf);
            }
            html += eachRow;
        }
        else {
            html += thRow;
        }
    }
    // html+=`\t<th>Actions</th>`
    html = wrapWithTag(html, '', '', 'tr');
    html = wrapWithTag(html, '', '', 'thead');
    return html;
}
function cleanSpanButton(html) {
    let span = htmlExtractTool.extractHtmlTag(html, 'span');
    if (!span)
        return html;
    let jhi = htmlExtractTool.extractAttribute(span, 'jhiTranslate');
    let authority = htmlExtractTool.extractAttribute(span, '\\*jhiHasAnyAuthority');
    let jhiVal = htmlExtractTool.extractAttributeValue(jhi);
    let repl = htmlExtractTool.replaceWithErrorHandle(html, '', "", span);
    repl = htmlExtractTool.replaceValueOfTag(repl, oHC.getObjectValue(jhiData, jhiVal));
    if (authority)
        repl = htmlExtractTool.addAttribute(repl, authority);
    return htmlExtractTool.addAttribute(repl, jhi) + '\n';
}
function genTbRows(compareHtml) {
    let table = htmlExtractTool.extractHtmlTag(compareHtml, "table");
    let tbody = htmlExtractTool.extractHtmlTag(table, "tbody");
    let ngIfNoRes = htmlExtractTool.matchWithErrorHandle(tbody, '<tr[\\n\\s.]*?\\*ngIf="![.\\s\\S\\n]*?</tr>');
    let ngif = htmlExtractTool.extractAttribute(ngIfNoRes, '\\*ngIf');
    let tr = htmlExtractTool.extractHtmlTag(tbody, "tr", "\\*ngFor=");
    let ngFor = htmlExtractTool.extractAttribute(tr, '\\*ngFor');
    let click = htmlExtractTool.extractAttribute(tr, '\\(click\\)');
    let tdRows = htmlExtractTool.extractAllTagWithAttr(tr, "td");
    // console.log(thRows)
    let html = ``;
    let noResHtml = ``;
    for (let tdRow of tdRows) {
        if (htmlExtractTool.isPresent(tdRow, '<div[.\\n\\S\\s]*?<button')) {
            let buttons = htmlExtractTool.extractAllTagWithAttr(tdRow, 'button');
            let buttonsHtml = ``;
            for (let button of buttons) {
                button = htmlExtractTool.removeAttribute(button, 'type');
                button = htmlExtractTool.removeAttribute(button, 'class');
                button = htmlExtractTool.addAttribute(button, 'class="link"');
                button = cleanSpanButton(button);
                buttonsHtml += button;
            }
            buttonsHtml = wrapWithTag(buttonsHtml, 'flex items-center gap-2');
            buttonsHtml = wrapWithTag(buttonsHtml, '', '', 'td');
            html += buttonsHtml;
        }
        else {
            if (tdRow.includes('noResultsFound')) {
                noResHtml += wrapWithTag(tdRow, '', ngif, 'tr');
            }
            else {
                html += tdRow;
            }
        }
        // let jhi = htmlExtractTool.extractAttribute(thRow,'jhiTranslate');
        // if(jhi){
        //     html+= genTheadRow(jhi);
        // }
    }
    if (click) {
        html = wrapWithTag(html, '', ngFor + '' + click, 'tr');
    }
    else {
        html = wrapWithTag(html, '', ngFor, 'tr');
    }
    if (noResHtml) {
        html += noResHtml;
    }
    html = wrapWithTag(html, '', '', 'tbody');
    return html;
}
// console.log(genTbRows(compareHtml))
function generateTableWithPag(compareHtml) {
    let html = ``;
    html += genThRows(compareHtml);
    html += genTbRows(compareHtml);
    html = wrapWithTag(html, 'table-box', '', 'table') + '\n';
    html += generatePaginator(getLastNgIf(compareHtml));
    html = '\n<!---TABLE-->\n' + wrapWithTag(html, 'p-3');
    return html;
}
function genPage(compareHtml) {
    let html = ``;
    let firstH6 = htmlExtractTool.extractHtmlTag(compareHtml, "h6");
    let jhi = htmlExtractTool.extractAttribute(firstH6, 'jhiTranslate');
    let header = genPageHeader(jhi);
    let sf = generateSearchForm(compareHtml);
    if (sf !== '') {
        html += sf;
        html = addSrchNClrButtons(html);
        html = indentAllLines(html);
        html = wrapWithTag(html, '', "class='flex flex-wrap items-center p-3 gap-4 border-t' *ngIf='showFilters'");
    }
    html += `\n<jhi-alert></jhi-alert>\n`;
    html += generateTableWithPag(compareHtml);
    html = genPageHeaderButtons(compareHtml, true) + html;
    html = `<!---HEAD-->\n` + html;
    html = wrapWithTag(html, "page-body");
    html = header + '\n' + html;
    html = wrapWithTag(html, 'w-full');
    return html.trim();
}
function oneLineSearchPage(compareHtml, header, sf) {
    let html = ``;
    if (sf !== '') {
        html += sf;
        html = addSrchNClrButtons(html);
        html = indentAllLines(html);
        html = wrapWithTag(html, '', "class='flex w-1/2 gap-2'");
    }
    html = html + genPageHeaderButtons2(compareHtml, true);
    html = wrapWithTag(html, '', 'class="flex justify-between items-center p-3"');
    html += `\n<jhi-alert></jhi-alert>\n`;
    html += generateTableWithPag(compareHtml);
    html = `<!---HEAD-->\n` + html;
    html = wrapWithTag(html, "page-body");
    html = header + '\n' + html;
    html = wrapWithTag(html, 'w-full');
    return html.trim();
}
function showFilterSearchPage(compareHtml, header, sf) {
    let html = ``;
    if (sf !== '') {
        html += sf;
        html = addSrchNClrButtons(html);
        html = indentAllLines(html);
        html = wrapWithTag(html, '', "class='flex flex-wrap items-center p-3 gap-4 border-t' *ngIf='showFilters'");
    }
    html += `\n<jhi-alert></jhi-alert>\n`;
    html += generateTableWithPag(compareHtml);
    html = genPageHeaderButtons(compareHtml, true) + html;
    html = `<!---HEAD-->\n` + html;
    html = wrapWithTag(html, "page-body");
    html = header + '\n' + html;
    html = wrapWithTag(html, 'w-full');
    return html.trim();
}
function genPage2(compareHtml) {
    let html = ``;
    let firstH6 = htmlExtractTool.extractHtmlTag(compareHtml, "h6");
    let jhi = htmlExtractTool.extractAttribute(firstH6, 'jhiTranslate');
    let header = genPageHeader(jhi);
    let sf = generateSearchForm(compareHtml);
    let counts = inputCount + selectCount;
    if (counts > 4) {
        html = showFilterSearchPage(compareHtml, header, sf);
    }
    else {
        html = oneLineSearchPage(compareHtml, header, sf);
    }
    return html;
}
// console.log(genPage(compareHtml).trim());
function getLastNgIf(html) {
    let regexp = new RegExp(`\\*ngIf=".*?"(?=[.\\s\\n]*?style="background-color: #f8f9fa;")`);
    let ngif = htmlExtractTool.extractAttribute(htmlExtractTool.matchWithErrorHandle(html, regexp), '\\*ngIf');
    return ngif;
}
// console.log(generateTableWithPag(compareHtml))
// console.log(htmlExtractTool.extractAttribute(compareHtml,'\\*ngIf[.\\s\\S\\n]*(?=background-color: #f8f9fa)'))
// console.log()
function generatePaginator(ngIf) {
    return `<div class="paginator-container" ${ngIf} >
          <mat-paginator
            [length]="totalItems"
            [pageSize]="itemsPerPage"
            [pageIndex]="page"
            [pageSizeOptions]="[5, 10, 15, 25, 50]"
            [showFirstLastButtons]="true"
            (page)="loadPage($event)"
          >
          </mat-paginator>
        </div>`;
}
// console.log(htmlExtractTool.extractAttribute(compareHtml,'\\*ngIf','',true))
function handleInput(input, type) {
    input = htmlExtractTool.removeAttribute(input, 'class');
    input = htmlExtractTool.removeAttribute(input, 'type');
    if (input?.toLowerCase().includes('date')) {
        input = htmlExtractTool.addAttribute(input, 'type="date"');
    }
    else {
        input = htmlExtractTool.addAttribute(input, 'type="search"');
    }
    input = wrapWithTag(input, "", `type="search" class="search-box"`);
    return input + '\n';
}
function addSrchNClrButtons(html) {
    return html + `
<button class="btn-dark-blue" (click)="search()">Search</button>\n
<button class="link" (click)="clear()" *ngIf="currentSearch">Clear</button>\n`;
}
function generateEntireListPageHtml(htmlText) {
    let html = ``;
    return html;
}
function warnUser(regex, input, output, name) {
    try {
        let inputCounts = htmlExtractTool.getMatchCounts(input, regex);
        let outputCounts = htmlExtractTool.getMatchCounts(output, regex);
        6;
        if (regex.includes('jhiTranslate')) {
            inputCounts -= 7;
        }
        if (inputCounts !== outputCounts) {
            console.error(`Input ${name} input count has ${inputCounts} and output count has ${outputCounts}`);
        }
        else {
            console.info(name + " is fine", inputCounts, outputCounts);
        }
    }
    catch (e) {
        console.warn(name + "skipped due to error", e);
    }
}
function compare(input, output) {
    warnUser('jhiTranslate="', input, output, 'JHI Translate');
    warnUser('\\*jhiHasAnyAuthority', input, output, 'JHI Has authority');
    warnUser('\\*ngIf', input + "*ngIf", output, 'Ng If');
    warnUser('\\*ngFor', input, output, 'Ng For');
    warnUser('\\[routerLink\\]', input, output, 'Router link');
    warnUser('\\(click\\)', input, output, 'Click');
    warnUser('\\[\\(ngModel\\)\\]', input, output + '[(ngModel)]', 'Ng model');
    warnUser('formControl', input, output, 'Form control');
}
function analyzeResults(input) {
    let pageHtml = genPage2(input);
    compare(input, pageHtml);
    return htmlFormatter.formatHTML(pageHtml.trim());
}
// let setUpUI = new SetupUI(analyzeResults);
//   if(type === 'i'){
//     console.log(input)
//   }else if(type === 's'){
//     console.log()
//   }else{
//     console.log("Else reached")
//   }
// function genPageBody()
//let str  = 'encoreclientApp.associates.home.heading'
// let arr = str.split('.').map((a)=>[a])
// let i = 0; while(arr.length!==0){ res = arr[i];arr.shift() }
// console.log(encoreclientApp)
// let formControl = htmlExtractTool.extractAttribute(input,'(\\[\\(ngModel\\)\\]|formControlName)')
// input = htmlExtractTool.removeAttribute(input,'(\\[\\(ngModel\\)\\]|formControlName)');
// input = htmlExtractTool.addAttribute(input,'formControl')
// function genSrchBxHtml(){
//   wrapWithTag()
//   for()
// }
// attr = htmlExtractTool.extractAttribute(input, "type");
// if(attr){
//   attrArr.push(attr);
// }
// function wrap(openTag,value,closeTag){
//   let nl ='\n'
//   return `${openTag+nl+value+nl+closeTag}`
// }
// function wrapDataWithDiv(value) {
//   return `<div class="w-full">${value}</div>`;
// }
// function wrapWithPageBody(value) {
//   return `<div class="page-body">${value}</div>`;
// }
// function generateSearchForm() {
//   return `<div class="flex w-1/2 gap-2">`+`</div>`;
// }
