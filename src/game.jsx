// import { useEffect, useRef } from "react";
// import { Header } from "./parts/header";
// import { Footer } from "./parts/footer";

// const Game = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     const resizeCanvas = () => {
//         canvas.width = window.innerWidth * 0.9;
//         canvas.height = window.innerHeight * 0.9;
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     return () => {
//         window.removeEventListener('resize', resizeCanvas);
//     };
//     }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Устанавливаем реальные размеры буфера = CSS-размерам
//     canvas.width = window.innerWidth * 0.9;
//     canvas.height = window.innerHeight * 0.9;

//     let x = 50;
//     let y = 50;
//     let dx = 2;
//     let dy = 2;

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       ctx.beginPath();
//       ctx.arc(x, y, 20, 0, Math.PI * 2);
//       ctx.fillStyle = "red";
//       ctx.fill();
//       ctx.closePath();

//       x += dx;
//       y += dy;

//       // Bounce
//       if (x + 20 > canvas.width || x - 20 < 0) dx = -dx;
//       if (y + 20 > canvas.height || y - 20 < 0) dy = -dy;

//       requestAnimationFrame(draw);
//     };

//     draw();
//   }, []);

//   return (
//     <>
//         <Header/>
//         <div style={{ textAlign: 'center', marginTop: '10vh' }}>
//         <canvas
//             ref={canvasRef}
//             // width={800}
//             // height={400}
//             style={{ width:'90vw',height:'90hv',border: "2px solid black", background: "#f0f0f0" }}
//         ></canvas>
//         </div>
//         <Footer/>
//     </>
//   );
// };

// export default Game;


import { Header } from './parts/header';
import { Footer } from './parts/footer';
import { GameCanvas } from './gameCanvas';

const Game = () => (
  <>
    <Header />
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <GameCanvas/>
    </div>
    <Footer />
  </>
);

export default Game;
