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

    const grade = await json.grades.find((grade) => grade.id === findId);
    if (grade) res.send(grade);
    else res.send(`Registro ${findId} não localizado.`);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.get("/:student/:subject", async (req, res) => {
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findStudent = req.params.student;
    const findSubject = req.params.subject;

    if (findStudent === "" || findSubject === "")
      throw new Error(
        `student ${findStudent} e subject ${findSubject} não localizado.`
      );
    let total = 0;
    let cont = 0;
    for (const curr of json.grades) {
      if (curr.student === findStudent && curr.subject === findSubject) {
        total += curr.value;
        ++cont;
      }
    }
    let media = 0;
    if (cont > 0) media = total / cont;
    res.send(`total da nota é ${total} e média ${media}`);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.post("/avange", async (req, res) => {
  try {
    let grade = req.body;
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findType = grade.type;
    const findSubject = grade.subject;

    if (findType === "" || findSubject === "")
      throw new Error(
        `student ${findType} e subject ${findSubject} não localizado.`
      );
    let total = 0;
    let cont = 0;
    for (const curr of json.grades) {
      if (curr.type === findType && curr.subject === findSubject) {
        total += curr.value;
        ++cont;
      }
    }
    let media = 0;
    if (cont > 0) media = total / cont;
    res.send(`total da nota é ${total} e média ${media}`);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.post("/find2", async (req, res) => {
  try {
    let grade = req.body;
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findType = grade.type;
    const findSubject = grade.subject;

    if (findType === "" || findSubject === "")
      throw new Error(
        `student ${findType} e subject ${findSubject} não localizado.`
      );
    let Melhores = [];
    for (const curr of json.grades) {
      if (curr.type === findType && curr.subject === findSubject) {
        Melhores = [...Melhores, curr];
      }
    }

    Melhores = Melhores.sort((a, b) => b.value - a.value);
    Melhores = Melhores.splice(0, 3);

    res.send(Melhores);
  } catch (error) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  let grade = req.body;
  try {
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);

    grade = { id: json.nextId++, ...grade, timestamp: new Date() };

    json.grades.push(grade);

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

    let grade = await json.grades.filter((grade) => grade.id !== findId);
    json.grades = grade;

    await writeFile(global.FileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    let newGrade = req.body;
    const data = await readFile(global.FileName);
    const json = JSON.parse(data);
    const findId = parseInt(newGrade.id, 10);

    let position = await json.grades.findIndex((grade) => grade.id === findId);

    if (position < 0) throw new Error(`ID ${findId} não localizado.`);

    json.grades[position].student = newGrade.student;
    json.grades[position].subject = newGrade.subject;
    json.grades[position].type = newGrade.type;
    json.grades[position].value = newGrade.value;
    json.grades[position].timestamp = new Date();

    await writeFile(global.FileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    Logger.error("erro no arquivo");
    res.status(400).send({ error: err.message });
  }
});

export default router;
