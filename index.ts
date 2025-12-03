import * as day_1 from "./src/day-1"
import * as day_2 from "./src/day-2"
const server = Bun.serve({
    port: 3000,
    routes: {
        "/": () => new Response('Bun!'),
        "/resolved/day-1": req => {
            return Response.json({ day_1 });
        },
        "/resolved/day-2": req => {
            return Response.json({ day_2 });
        },
    }
});

console.log(`Listening on ${server.url}`);