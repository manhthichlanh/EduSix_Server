const express = require("express")
const fs = require("fs")

const app = express();

let count = 0;

app.get("/", async (req, res) => {
    let i = 0;
    while (i < 100) {
        await fs.promises.readFile("public/videos/1.Gitinitvagitconfig.mp4", (err, data) => {
            if (err) {
                console.log(err);
            }
        });
        console.log("READ " + i + "TIMES");
        i++;
    }
    return res.send("Done!")
});

app.get("/read", (req, res) => {
    count++;
    res.json(count)
})


app.listen(3006, async () => {
    console.log("🚀Server started Successfully! Running in port ");
});
