// Welcome to the tutorial!
import { createServer, Model, hasMany, belongsTo, RestSerializer } from 'miragejs'

export default function () {
    createServer({
        serializers: {
            reminder: RestSerializer.extend({
                include: ["list"],
                embed: true,
            })
        },
        models: {
            list: Model.extend({
                reminders: hasMany(),
            }),
            reminder: Model.extend({
                list: belongsTo(),
            }),
        },
        seeds(server) {
            let homeList = server.create("list", { name: "Home" })
            let workList = server.create("list", { name: "Work" })

            server.create("reminder", { text: "Walk the dog", })
            server.create("reminder", { text: "Take out the trash" })
            server.create("reminder", { text: "Work out" })

            server.create("reminder", { list: homeList, text: "Do taxes" })
            server.create("reminder", { list: workList, text: "Visit bank" })
        },
        routes() {
            this.get("/api/reminders", (schema) => {
                return schema.reminders.all()
            })

            this.post("/api/reminders", (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                console.log(attrs)
                return schema.reminders.create(attrs)
            })

            this.delete("/api/reminders/:id", (schema, request) => {
                let id = request.params.id

                return schema.reminders.find(id).destroy()
            })

            this.get('/api/lists', (schema, request) => {
                return schema.lists.all()
            })

            this.get('/api/lists/:id/reminders', (schema, request) => {
                let listId = request.params.id
                let list = schema.lists.find(listId)

                return list.reminders
            })
        },
    })
}