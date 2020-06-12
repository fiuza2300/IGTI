import express from "express";
import { promises } from "fs";

const router = express.Router();
const { writeFile, readFile, appendFile } = promises;

router.get("/", async (_, res) => {
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findId = parseInt(req.params.id, 10);

    const account = await json.account.find((account) => account.id === findId);
    if (account) res.send(account);
    else res.send(`Registro ${findId} não localizado.`);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  let account = req.body;
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);

    account = { id: json.nextId++, ...account };

    json.account.push(account);

    await writeFile(global.FileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findId = parseInt(req.params.id, 10);

    let account = await json.account.filter((account) => account.id !== findId);
    json.account = account;

    await writeFile(global.FileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    let newAccount = req.body;
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findId = parseInt(newAccount.id, 10);

    let position = await json.account.findIndex(
      (account) => account.id === findId
    );

    //json.account[position] = newAccount;
    json.account[position].name = newAccount.name;
    json.account[position].balance = newAccount.balance;

    await writeFile(global.FileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.post("/transaction", async (req, res) => {
  try {
    let newAccount = req.body;
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findId = parseInt(newAccount.id, 10);

    let position = await json.account.findIndex(
      (account) => account.id === findId
    );

    if (position < 0) throw new Error(`ID ${findId} não localizado.`);

    let compare = json.account[position].balance + newAccount.balance;
    if (parseFloat(newAccount.balance) < 0 && compare < 0) {
      throw new Error("Não há saldo suficiente.");
    }

    json.account[position].balance += newAccount.balance;

    await writeFile(global.FileName, JSON.stringify(json));
    res.send(`Novo valor ${json.account[position].balance}`);
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

export default router;
