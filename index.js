const PacienteFactory = require("./factory/pacienteFactory");
const pacienteService = PacienteFactory.generateInstace();

//cabeçalho
const DEFAULT_HEADER = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};

const handleError = response => {
  return (error) => {
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal Server Error" }));
    return response.end();
  };
};

// rotas
const routes = {
  "/paciente:get": async (request, response) => {
    const { id } = request.queryString;
    const { url, method } = request;
    const [first, route] = url.split("/");
    const pacientes = await pacienteService.find(id);
    response.write(JSON.stringify({ paciente: pacientes }));
    await Promise.reject("/paciente:get")
    const data = new Date();

    console.log(
      `${data.getFullYear()}-${data
        .getMonth()
        .toString()
        .padStart(2, "0")}-${data
        .getDate()
        .toString()
        .padStart(2, "0")} ${method} /${route}`
    );
    return response.end();
  },
  default: async (request, response) => {
    try{

      response.write(JSON.stringify("Cannot GET/"));
      await Promise.reject("default")
  
      const { id } = request.queryString;
      const { url, method } = request;
      const [first, route] = url.split("/");
      const data = new Date();
  
      console.log(
        `${data.getFullYear()}-${data
          .getMonth()
          .toString()
          .padStart(2, "0")}-${data
          .getDate()
          .toString()
          .padStart(2, "0")} ${method} /${route}`
      );
      response.end();
    }catch(error){
      return handleError(response)(error)
    }
  },
};

//criando chamadas
const handler = (request, response) => {
  const { url, method } = request;
  const [first, route, id] = url.split("/");0
  response.writeHead(200, DEFAULT_HEADER); // cabeçalho Requisição

  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`; // criando uma rota

  const chosen = routes[key] || routes.default;

  return chosen(request, response).catch(handleError(response));
};

const httpServer = require("http").createServer(handler);
const PORT = 3002;
const WebSocketServer = require("ws");

const socketServer = new WebSocketServer.Server({ server: httpServer });

let sockets = [];

// Server Socket
socketServer.on("connection", function connection(socket, req) {
  console.log("Conect ", req.socket.remoteAddress);
  sockets.push(socket);

  // envio mensagem de confirmação para o Cliente
  socket.send(
    JSON.stringify({
      code: socket.readyState,
      mensagem: `${req.socket.remoteAddress} Conectado`,
    })
  );

  // Recebe os dados do cliente
  socket.on("message", async function incoming(message) {
    const dado = JSON.parse(message);
    const paciente = {
      id: dado.id,
      name: dado.name,
      sistolica: dado.sistolica,
      diastolica: dado.diastolica,
      temperatura: dado.temperatura,
      equipamento: dado.equipamento,
    };
    console.log(paciente); // visualiza dado enviado
    const existe = await pacienteService.findName(paciente.name);
    if (existe) {
      const status = await pacienteService.updateValue(paciente.name, paciente);
    } else {
      const id_paci = await pacienteService.create(paciente);
      socket.send(
        JSON.stringify({
          mensagem: `Paciente Cadastrado com ${id_paci}`,
        })
      );
    }
  });

  // Quando o Cliente Encerra a conexão
  socket.on("close", function () {
    socket.send(
      JSON.stringify({
        code: socket.readyState,
      })
    );
    let so = sockets.findIndex((s) => s == socket);
    sockets = sockets.filter((s) => s !== socket);
    console.log("Socket desconectado: ", req.socket.remoteAddress);
  });
});

httpServer.listen(PORT, () => {
  console.log("server running", PORT);
});

httpServer.on("error", (error) => {
  console.log("Error");
});
