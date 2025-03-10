export const ctxHandler = (ref) => {
  const ctx = ref.getContext('2d');
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ff8000';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const coords = [];

  const lineTo = (x,y) => {
    ctx.lineTo(x,y);
    ctx.stroke();
    coords.push(`l ${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  const moveTo = (x,y) => {
    ctx.beginPath();
    ctx.moveTo(x,y);
    coords.push(`m ${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  const getCoords = () => coords.join(',');
  return (
    {
      lineTo: lineTo,
      moveTo: moveTo,
      getCoords: getCoords,
    }
  )
}

const drawOneAvatarLine = (ctx, command) => {
  const [type, x, y] = command.split(' ');
  switch (type) {
    case 'l':
      ctx.lineTo(x, y);
      break;
    case 'm':
      ctx.moveTo(x, y);
      break;
    default:
      throw new Error(`Unknown command "${type}"`);
  }
}

export const drawAvatar = (avatar, ctx) => {
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (avatar) {
    avatar.split(',').forEach(command => {
      if (command) {
        drawOneAvatarLine(ctx, command);
      }
    });
    ctx.stroke();
  }
}

export const animateAvatar = (avatar, ctx) => {
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const splitAvatar = avatar.split(',');
  let i = 0 ;
  const animate = () => {
    const command = splitAvatar[i];
    drawOneAvatarLine(ctx, command);
    ctx.stroke();
    i += 1;
    if (i === splitAvatar.length) {
      return
    }
    requestAnimationFrame(animate);
  }
  animate();
}

export const copyContents = (contents) => {
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");
  document.getElementById("dummy_id").value=contents;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}


