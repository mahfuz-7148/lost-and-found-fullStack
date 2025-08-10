require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
// const admin = require("firebase-admin");
// const serviceAccount = require("./b11-a9-job-track-firebase-adminsdk.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const corsOptions = {
//     origin: ['https://lost-and-found-full-stack-mlo8.vercel.app'],
//     credentials: true,
//     optionSuccessStatus: 200,
// }
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// const verifyFirebaseToken = async (req, res, next) => {
//     const authHeader = req?.headers?.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).send({message: 'unauthorized'})
//     }
//     const token = authHeader.split(' ')[1]
//     try {
//         const decoded = await admin.auth().verifyIdToken(token)
//         req.decoded = decoded
//         next()
//     }
//     catch (error) {
//         return res.status(401).send({message: 'unauthorized'})
//     }
// }
// const verifyTokenEmail = async (req, res, next) => {
//     if (req.query.email !== req.decoded.email) {
//         return res.status(403).send({message: 'forbidden'})
//     }
//     next()
// }
// const verifyToken = async (req, res, next) => {
//     const token = req.cookies?.token
//
//     if (!token) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             console.log(err)
//             return res.status(401).send({ message: 'unauthorized access' })
//         }
//         req.user = decoded
//         next()
//     })
// }


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@lost-found.mmu9lkl.mongodb.net/?retryWrites=true&w=majority&appName=lost-found`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const itemsCollection = client.db('lostFoundDB').collection('items')
        const recoveryCollection = client.db('lostFoundDB').collection('recoveryItems')

        // app.post('/jwt', async (req, res) => {
        //     const email = req.body
        //     const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '365d',
        //     })
        //     res
        //         .cookie('token', token, {
        //             httpOnly: true,
        //             secure: process.env.NODE_ENV === 'production',
        //             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        //         })
        //         .send({ success: true })
        // })
        // // Logout
        // app.get('/logout', async (req, res) => {
        //     try {
        //         res
        //             .clearCookie('token', {
        //                 maxAge: 0,
        //                 secure: process.env.NODE_ENV === 'production',
        //                 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        //             })
        //             .send({ success: true })
        //     } catch (err) {
        //         res.status(500).send(err)
        //     }
        // })

        app.get("/allItem", async (req, res) => {
            try {
                const { search, filter } = req.query;
                let query = {};

                if (filter && filter !== "all") {
                    if (filter === "Recovered") {
                        query.status = "Recovered";
                    } else {
                        query.postType = filter;
                        query.status = { $ne: "Recovered" };
                    }
                }

                if (search) {
                    query.$or = [
                        { title: { $regex: search, $options: "i" } },
                        { location: { $regex: search, $options: "i" } },
                    ];
                }

                const allItems = await itemsCollection.find(query).toArray();
                res.send(allItems);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch items", error: error.message });
            }
        });

        app.get("/allItems", async (req, res) => {
            try {
                const { email } = req.query;
                let query = {};
                if (email) {
                    query.email = email;
                } else {
                    return res.status(400).send({ message: "Email query parameter is required" });
                }

                const allItems = await itemsCollection.find(query).toArray();
                res.send(allItems);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch items", error: error.message });
            }
        });


        app.post("/addItems", async (req, res) => {
            try {
                const result = await itemsCollection.insertOne(req.body);
                res.status(201).send({
                    message: "Item added successfully",
                    insertedId: result.insertedId,
                });
            } catch (error) {
                res.status(500).send({ message: "Failed to add item", error: error });
            }
        });

        app.get("/items", async (req, res) => {
            try {
                const sortParam = req.query.sort;
                const limit = parseInt(req.query.limit) || 0;
                let sortOption = {};
                if (sortParam === "date_desc") sortOption = { date: -1 };

                const items = await itemsCollection.find().sort(sortOption).limit(limit).toArray();
                res.send(items);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch items", error: error });
            }
        });

        app.get("/recoveredItems", async (req, res) => {
            const email = req.query.email;
            const filter = { "recoveredBy.email": email }
            try {
                const items = await recoveryCollection.find(filter).toArray();
                res.send(items);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch recovered items", error: error });
            }
        });

        app.post("/recoveredItems", async (req, res) => {
            const recoveredItem = req.body;
            try {
                const filter = {
                    originalItemId: new ObjectId(recoveredItem.originalItemId),
                }
                await recoveryCollection.findOne(filter);

                const result = await recoveryCollection.insertOne(recoveredItem);
                res.status(201).send({ insertedId: result.insertedId });
            } catch (error) {
                res.status(500).send({ message: "Failed to add recovered item", error });
            }
        });

        app.get("/items/:id", async (req, res) => {
            try {
                const item = await itemsCollection.findOne({ _id: new ObjectId(req.params.id) });
                if (!item) return res.status(404).send({ message: "Item not found" });
                res.send(item);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch item", error: error });
            }
        });

        app.patch("/items/:id", async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;

            try {
                const result = await itemsCollection.updateOne(
                    {
                        _id: new ObjectId(id)
                    },
                    {
                        $set: { status }
                    }
                );
                if (result.matchedCount === 0)
                    return res.status(404).send({ error: "Item not found" });
                res.send({ modifiedCount: result.modifiedCount });
            } catch (error) {
                res.status(500).send({ error: "Internal Server Error" });
            }
        });

        app.put("/updateItems/:id", async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedItem
            };

            try {
                const result = await itemsCollection.updateOne(filter, updateDoc);
                res.send({ modifiedCount: result.modifiedCount });
            } catch (error) {
                res.status(500).json({ error: "Failed to update item." });
            }
        });


        app.delete("/items/:id", async (req, res) => {
            const id = req.params.id;

            try {
                const result = await itemsCollection.deleteOne({
                    _id: new ObjectId(id),
                });
                if (result.deletedCount === 0)
                    return res.status(404).send({ error: "Item not found" });
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Internal Server Error" });
            }
        });


        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});