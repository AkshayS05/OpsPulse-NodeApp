require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
const { dvGet, dvPost } = require('./dataverse');

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'OpsPulse Portal API', version : 7 });
});



app.use((req,res,next) => {
const key = req.headers['x-api-key'];
if(!key || key !== process.env.API_KEY){
    return res.status(401).json({errors: [{message: "Unauthorized"}]});
}
next();
}); 

app.get("/api/cases", async(req,res) => {
    
    try {
        let query = 'ops_incidents?$select=ops_name,ops_shipper,ops_agent,ops_stationcode,ops_status,ops_lostpackage,createdon&$top=50&$orderby=createdon desc';
      
        const filters = [];
        if(req.query.lost) filters.push(`ops_lostpackage eq ${req.query.lost}`);
        if(req.query.station) filters.push(`ops_stationcode eq '${req.query.station}'`);
        if(filters.length > 0) {
            query += `&$filter=${filters.join(' and ')}`;
        }
        const data = await dvGet(query);
        res.json(data);
    }
    catch (e) {
        console.error('Failed:', e.message);
        res.status(500).json({ error: e.message });
    }
})


app.get("/api/cases/:id",async (req,res) =>{
    const caseName = req.params.id;
    try{
        const results = await dvGet(`ops_incidents?$filter=ops_name eq '${caseName}'&$top=1`);
        if(results.length === 0){ return res.status(404).json({message: "Case Not Found"}) }
        res.json(results[0]);    
    }

    catch(e){
        console.error('Failed:', e.message);
        res.status(500).json({ error: e.message });
    }   
})


app.post("/api/cases",async(req,res) =>{
try{

    const {name, station, lost} = req.body;
    
    if (!name || !station) {
        return res.status(400).json({ message: "name and station are required" });
    }
    const created = dvPost('ops_incidents', {
        ops_name: name,
        ops_stationcode: station,
        ops_lostpackage: lost === true
    });
    res.status(201).json({ message: "Case created", case: created });
}

catch(e){
    console.error('Failed:', e.message);
    res.status(500).json({ error: e.message });
}
});

app.get('/api/stations', async (req, res) => {
  try {
  const rows = await dvGet('ops_stations?$select=ops_stationcode&$top=100');
    res.json(rows.map(r => ({ value: r.ops_stationcode, label: r.ops_stationcode })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000,()=>console.log("Server is running on port 3000"));