db = new Mongo().getDB("demo");
// Datos de prueba
if (db.posts.count() === 0) {
    db.posts.insertMany([
        { title: "First Post", content: "This is the first post" },
        { title: "Second Post", content: "This is the second post" },
    ]);
}
