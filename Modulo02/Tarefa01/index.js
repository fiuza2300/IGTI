import { promises } from "fs";
import { inherits } from "util";

const { readFile, writeFile } = promises;
let estados = LerArquivo("./dados/Estados.json");
let cidades = LerArquivo("./dados/Cidades.json");

//GeraArquivosJson();
//QtdeCidades("TO");
//NomeCidade("TO", 1);
//NomeCidade("TO", 2);

// CincoMaioresCidades();
CincoMenoresCidades();
//MaiorNomePorEstado();
// MenorNomePorEstado();

//MenorNome();

async function LerArquivo(file) {
  try {
    const resp = await readFile(file);
    const data = JSON.parse(resp);
    let Aux = [];

    data.forEach((element) => {
      Aux = [...Aux, element];
    });
    return Aux;
  } catch (error) {
    console.log(error);
  }
}

async function GeraArquivosJson() {
  (await estados).forEach(async (element) => {
    let { ID, Sigla } = element;
    let conteudo = await funcCidades(ID);
    let nomeFile = `./estados/${Sigla}.json`;
    await writeFile(nomeFile, JSON.stringify(conteudo));
  });
}

async function funcCidades(ID) {
  let Aux = [];
  (await cidades).forEach((element) => {
    if (element.Estado === ID) {
      Aux = [...Aux, element];
    }
  });
  return Aux;
}

async function QtdeCidades(UF) {
  let state = LerArquivo(`./estados/${UF}.json`);

  let total = 0;
  (await state).forEach((element) => {
    if (element.ID !== "") {
      ++total;
    }
  });
  return total;
  //console.log(total);
}

async function CincoMaioresCidades() {
  let Aux = [];
  (await estados).forEach(async (element) => {
    let { Sigla } = element;
    let qtde = await QtdeCidades(Sigla);
    Aux = [...Aux, { Sigla, TotalCidades: qtde }];
    console.log("####");
    (await Aux).sort((a, b) => {
      return b.TotalCidades - a.TotalCidades;
    });
    for (let index = 0; index < 5; index++) {
      console.log(Aux[index]);
    }
  });
}

async function CincoMenoresCidades() {
  let Aux = [];
  (await estados).forEach(async (element) => {
    let { Sigla } = element;
    let qtde = await QtdeCidades(Sigla);
    Aux = [...Aux, { Sigla, TotalCidades: qtde }];
    console.log("####");
    (await Aux).sort((a, b) => {
      return a.TotalCidades - b.TotalCidades;
    });
    for (let index = 0; index < 5; index++) {
      console.log(Aux[index]);
    }
  });
}

async function MaiorNomePorEstado() {
  let Aux = [];
  (await estados).forEach(async (element) => {
    let { Sigla } = element;
    let MaiorCidade = await NomeCidade(Sigla, 2);
    Aux = [...Aux, { Sigla, MaiorCidade }];
    console.log("####");
    console.log(Aux);
  });
}

async function MenorNomePorEstado() {
  let Aux = [];
  (await estados).forEach(async (element) => {
    let { Sigla } = element;
    let MaiorCidade = await NomeCidade(Sigla, 1);
    Aux = [...Aux, { Sigla, MaiorCidade }];
    console.log("####");
    console.log(Aux);
  });
  return Aux;
}

async function NomeCidade(UF, tipo) {
  let state = LerArquivo(`./estados/${UF}.json`);
  let Aux = [];
  (await state).forEach((element) => {
    let { Nome } = element;
    Aux = [...Aux, { UF, Nome }];
  });

  (await Aux).sort((a, b) => a.Nome.length - b.Nome.length);

  let retorno = Aux.splice(tipo === 1 ? 0 : -1, 1);
  return retorno[0].Nome;
}

async function MenorNome() {
  let Aux = await MenorNomePorEstado();
  (await Aux).sort((a, b) => a.Nome.length - b.Nome.length);
  console.log(Aux.splice(0, 1));
}
