const express = require('express');
const cors= require('cors');
const app= express();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const uri = "mongodb+srv://ishaan:hibye123@cluster0.q8tnk.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
const database = client.db('deepthoughtdb');
const events = database.collection('events');

app.use(express.json())
app.use(cors())


// /events?id=:event_id
app.get("/api/v3/app/events",async(req,res)=>{
    await client.connect();
    const id= req.query.id;
    console.log(id);
    const query={_id : ObjectId(id)};
    const result = await events.findOne(query);
    console.log(result)   
    res.send(result);
})

//latest 5 events
app.get("/api/v3/app/events",async(req,res)=>{
    await client.connect();
    const type= req.params.type;
    const limit= parseInt(req.query.limit);
    const page=  parseInt(req.query.page);
    const result= await events.find().sort({schedule: -1}).limit(limit).skip((page-1)*limit).toArray();
    console.log(result.length);
    res.send(result);
})


//events post full event details
app.post("/api/v3/app/events",async(req,res)=>{
    await client.connect();
    const doc={
        type: "event",
        name: req.body.name,
        uid: 5,
        tagline: req.body.tagline,
        schedule: Date.now(),
        description: req.body.description,
        files: req.body.files,
        moderator: req.body.moderator,
        category: req.body.category,
        sub_category: req.body.sub_category,
        rigor_rank: req.body.rigor_rank,
        attendees: req.body.attendees,
    }
    const result = await events.insertOne(doc);
    console.log(result);
    res.send(result.insertedId);
})

//delete event
app.delete("/api/v3/app/events/:id",async(req,res)=>{
    await client.connect();
    const id= req.params.id;
    const query={_id : ObjectId(id)};
    const result = await events.deleteOne(query);
    console.log(result);
    res.send(result);
})


//update event
app.put("/api/v3/app/events/:id",async(req,res)=>{
    await client.connect();
    const id= req.params.id;
    const query={_id : ObjectId(id)};
    const doc={$set:{
        type: "event",
        name: req.body.name,
        uid: 5,
        tagline: req.body.tagline,
        schedule: Date.Now(),
        description: req.body.description,
        files: req.body.files,
        moderator: req.body.moderator,
        category: req.body.category,
        sub_category: req.body.sub_category,
        rigor_rank: req.body.rigor_rank,
        attendees: req.body.attendees,
    }
    }
    const result = await events.updateOne(query,doc,{upsert:true});
    console.log(result);
    res.send(result);
})

app.listen(5000,function(){ console.log("Listening on Port 5000")});


