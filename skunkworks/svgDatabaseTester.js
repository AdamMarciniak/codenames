const db = require("../server/queries");
const fs = require('fs');



const doData = async () => {
 fs.readFile('./svgSample.txt.gz', 'hex', async (err, data) => {
        console.log('data',data);
        data = '\\x' + data;
        for (let i = 0; i < 10000; i+=1) {
          db.insertAvatar(1, data);
        }
        // const imageData = await db.getAvatar(1);
        // console.log(imageData);
        // fs.writeFile('output.txt.gz', imageData, (err, result) => {
        //   console.log(err)
        //   return;
        // });
      });

  


}


doData();



