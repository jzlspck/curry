function draw() {
   /** @type {HTMLCanvasElement} */
   // 真实画板和虚拟画板
   // 虚拟画板用来绘制图片，得到图片像素点
   const canvasR = document.getElementById('really');
   const canvasI = document.getElementById('invented');
   const ctxR = canvasR.getContext('2d');
   const ctxI = canvasI.getContext('2d');
   const img_width = 320;
   const img_height = 202;

   // 延迟器函数
   function delayFn(time = 500) {
      return new Promise(reslove => setTimeout(() => reslove(), time));
   }

   // 绘制图片
   function drawImg(ctx, num) {
      const img = new Image();
      img.src = `./curry${num}.jpg`;
      return new Promise(reslove => {
         img.onload = function() {
            ctx.drawImage(img, 0, 0, img_width, img_height);
            reslove();
         }
      });
   }

   // 绘制图片第一次
   function drawFirst() {
      return new Promise(reslove => {
         drawImg(ctxR, 1).then(delayFn).then(() => {
            let x = img_width - 10;
            let y = img_height;
            const timer = setInterval(() => {
               ctxR.clearRect(x, y, 10, 10);
               x -= 10;
               if (x <= -10) {
                  x = img_width - 10;
                  y -= 10;
                  if (y <= -10) {
                     clearInterval(timer);
                     reslove();
                  }
               }
            }, 16);
         });
      });
   }

   // 绘制图片第二次
   function drawNext() {
      drawImg(ctxI, 2).then(() => {
         let x = 0;
         let y = 0;
         const timer = setInterval(() => {
            // 从虚拟画板提取像素点10×10
            const imgData = ctxI.getImageData(x, y, img_width, img_height);
            // 在真实&&画板绘制
            ctxR.putImageData(imgData, x, y, 0, 0, 10, 10);
            x += 10;
            // 画完一行
            if (x >= img_width) {
               x = 0;
               y = y + 10;
               // 画完一行，且到达底部
               if (y >= img_height) {
                  clearInterval(timer);
                  // 清除定时器 删除虚拟画板
                  document.body.removeChild(canvasI);
               }
            }
         }, 16);
      });
   }

   drawFirst().then(delayFn).then(drawNext);
}
window.addEventListener('load', draw);