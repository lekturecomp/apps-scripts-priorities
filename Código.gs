//TROQUE O LINK ENTRE ASPAS DUPLAS, PELO LINK DA SUA PLANILHA
//O LINK DEVE CONTER O HTTPS, CLIQUE DUAS VEZES NO LINK DA SUA PLANILHA PARA ISSO ACONTECER
//DEPOIS DE CLICAR DUAS VEZES, COPIE O LINK COM O HTTPS, E SUBSTITUA O LINK ABAIXO PELO SEU

let url = "https://docs.google.com/spreadsheets/d/1MYz5i-MPKj6-6fVcf3mPfkH8lqyhdTzkgBysuhD0pug/edit#gid=0"

// A FUNÇÃO ABAIXO CRIA A PAGINA HTML COM ALGUNS PARAMETROS
function doGet(e) { 

// É PRECISO TER O COMANDO "return" POIS ELE É QUEM PASSA OS DAOD PARA O NAVEGADOR
//SEM ELE VOCE NÃO IRA PASSAR OS DADOS PARA O LADO DO CLIENTE

return HtmlService.createTemplateFromFile('index').evaluate() //"CONSULTA" É O NOME DO ARQUIVO, ONDE CRIAREMOS O NOSSO HTML PARA CRIAR A PAGINA DO WEB APP
.addMetaTag('viewport', 'width=device-width, initial-scale=1') //NÃO ALTERE ESTA LINHA, ESTUDE A DOCUMENTAÇÃO ANTES DE ALTERAR
.setTitle('Priorização de Projetos')// CRIA O TITULO DO SEU SITE
.setFaviconUrl("https://i.imgur.com/MEUICONEFAVICON.png") //COLOCA O ICONE DO SEU SITE, FAVICON DO SITE
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);//ESTUDE A DOCUMENTAÇÃO ANTES DE ALTERAR ESTA LINHA
};


function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Organizar Tarefas')
    .addItem('Executar', 'organizeTasks')
    .addToUi();
}

function organizeTasks() {

  let html = HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setHeight(400)
    .setWidth(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'Organizar Prioridade');

}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getProjectsList() {

  let intervalo = "Página1!A2:B";
  let plan = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let ult = plan.getLastRow(); 
  let joined = intervalo + ult;  


  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let activeSheet = ss.getActiveSheet();
  let arr = activeSheet.getRange(2,1,activeSheet.getLastRow()-1,2).getValues();  
  

  let projects = SpreadsheetApp.getActiveSheet().getRange(joined);
  //sort by column 2 -> index 1
  
  Logger.log(projects.getNumRows());
  
  let numbers = [];
  let textvals = [];
  
  arr.map(function(r,i){
    let d = r[1];
    if(typeof d === "number"){
      numbers.push([i,d]);
    } else {
      textvals.push([i,d.toString().toLowerCase()]);
    }
  })
  
  numbers.sort(sortNumbers);
  textvals.sort(sortAlpha);
 
  
  let numbersSorted = numbers.map(function(d){
    return arr[d[0]];
  });
  let textSorted = textvals.map(function(d){
    return arr[d[0]];
  });  
  
  let sortedArray = textSorted.concat(numbersSorted);
 
  
  let list = '';
  for (let i = 0; i < projects.getNumRows(); i++) {    
    list += '<li>' + sortedArray[i][0] + '</li>';
  }
 
  return list
  
}


function setPriority(items) {

  let intervalo = "Página1!A2:B";
  let plan = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let ult = plan.getLastRow(); 
  let joined = intervalo + ult;

  
  let projects = SpreadsheetApp.getActiveSheet().getRange(joined);
  let order = [];
  
  for (let i = 0; i < projects.getNumRows(); i++) {
    //order.push([projects.getValues()[i][0], items]);
    order.push([projects.getValues()[i][0], items.indexOf(projects.getValues()[i][0])+1]);
    //order.push([projects.getValues()[i][0], i]); //TESTE PARA SABER SE A COLUNA PRIORIDADE ESTA SENDO ALTERADA

    
  }
  projects.setValues(order);

}
/** FUNCAO PARA TESTAR O DICIONARIO, PORQUE NA FUNCAO ACIMA NAO ESTA FUNCIONANDO */
function exibir() {
  let dict = {'A' : 1, 'B' : 2, 'C' : 3};

  for (let k in dict)
    Logger.log(k + ' : ' + dict[k]);
}

function sortNumbers(a,b){
  return a[1] - b[1];
}



function sortAlpha(r1,r2){
    // a = 4
    // b = 2
    let a = r1[1];
    let b = r2[1];
    if(a > b){
      return -1;
    } else if(a < b){
      return 1;
    }
    return 0;
    
  }
