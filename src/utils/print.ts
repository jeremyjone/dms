export const printLogo = () => {
  const beast = `
  ███████╗  ███████╗  ███████╗  ███████╗  ███╗      ███╗  ██╗   ██╗
     ██╔═╝  ██╔════╝  ██╔══██║  ██╔════╝  ████╗    ████║   ██╗ ██╔╝
     ██║    ██████╗   ███████║  ██████╗   ██║██╗  ██║██║    ████╔╝
  █╗ ██║    ██╔═══╝   ██╔═██╔╝  ██╔═══╝   ██║ ██╗██╔╝██║     ██╔╝
   ███╔╝    ███████╗  ██║  ██╗  ███████╗  ██║  ███╔╝ ██║     ██║
   ╚══╝     ╚══════╝  ╚═╝  ╚═╝  ╚══════╝  ╚═╝  ╚══╝  ╚═╝     ╚═╝
  `;

  // ASCII - ANSI Shadow
  const text = `${process.env.NODE_ENV === "development" ? beast : ""}\n
  \n\tData Management System ${require("@/../package.json").version}
  \t©${new Date().getFullYear()} By JeremyJone丶小鹰
  \n`;
  console.log(`%c${text}`, "color: #1cd6ee");
};
