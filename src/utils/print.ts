export const printLogo = () => {
  const jeremyjone = `
  ███████╗  ███████╗  ███████╗  ███████╗  ███╗      ███╗  ██╗   ██╗
     ██╔═╝  ██╔════╝  ██╔══██║  ██╔════╝  ████╗    ████║   ██╗ ██╔╝
     ██║    ██████╗   ███████║  ██████╗   ██║██╗  ██║██║    ████╔╝
  █╗ ██║    ██╔═══╝   ██╔═██╔╝  ██╔═══╝   ██║ ██╗██╔╝██║     ██╔╝
   ███╔╝    ███████╗  ██║  ██╗  ███████╗  ██║  ███╔╝ ██║     ██║
   ╚══╝     ╚══════╝  ╚═╝  ╚═╝  ╚══════╝  ╚═╝  ╚══╝  ╚═╝     ╚═╝
  `;

  // ASCII - ANSI Shadow
  const text = `${jeremyjone}\n
  \n\tData Management System ${require("@/../package.json").version}
  \t©${new Date().getFullYear()} By JeremyJone丶小鹰
  \n`;
  console.log(`%c${text}`, "color: #1cd6ee");
};
