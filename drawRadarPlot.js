function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

export function drawRadarPlot(ctx, scores, x, y, width, height) {
    // ctx.strokeStyle = 'pink';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(x, y, width, height);

    ctx.translate(x + width / 2, y + height / 2);
    let outlineWidth =  4 * width / 5;
    let outlineHeight = 4 * height / 5;

    // Box outline
    ctx.strokeStyle = 'rgb(33, 33, 33)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-outlineWidth / 2, -outlineHeight / 2, outlineWidth, outlineHeight);

    // Outer labels
    ctx.fillStyle = 'red';
    ctx.font = '16px Roboto';
    ctx.textAlign = 'left';
    ctx.fillText('Process', -outlineWidth / 2 + 30, -outlineHeight / 2 - 10);
    ctx.fillText('Slow', -outlineWidth / 2 + 30, outlineHeight / 2 + 20);
    ctx.textAlign = 'right';
    ctx.fillText('Results', outlineWidth / 2 - 30, -outlineHeight / 2 - 10);
    ctx.fillText('Fast', outlineWidth / 2 - 30, outlineHeight / 2 + 20);
    ctx.fillStyle = 'rgb(33, 33, 33)';
    ctx.textAlign = 'center';
    ctx.fillText('Expressive', 0, -outlineHeight / 2 + 20);
    ctx.fillText('Reserved', 0, outlineHeight / 2 - 10);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 18px Roboto';
    ctx.fillText('FOCUS', 0, -height / 2 + 30);
    ctx.fillText('PACE', 0, height / 2 - 20);

    ctx.rotate(-90 * Math.PI / 180);
    ctx.fillText('APPROACH', 0, -height / 2 + 30);
    ctx.fillText('PERSPECTIVE', 0, height /  2 - 20);

    ctx.font = '16px Roboto';
    ctx.textAlign = 'left';
    ctx.fillText('Structured', -outlineWidth / 2 + 30, -outlineHeight / 2 - 10);
    ctx.fillText('Local', -outlineWidth / 2 + 30, outlineHeight / 2 + 20);
    ctx.textAlign = 'right';
    ctx.fillText('Unstructured', outlineWidth / 2 - 30, -outlineHeight / 2 - 10);
    ctx.fillText('Global', outlineWidth / 2 - 30, outlineHeight / 2 + 20);
    ctx.fillStyle = 'rgb(33, 33, 33)';
    ctx.textAlign = 'center';
    ctx.fillText('Listen', 0, -outlineHeight / 2 + 20);
    ctx.fillText('Speaks', 0, outlineHeight / 2 - 10);
    ctx.rotate(90 * Math.PI / 180);

    // Dashed lines
    ctx.strokeStyle = 'rgb(33, 33, 33)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2.5, 5]);
    line(ctx, -outlineWidth / 2, 0, outlineWidth / 2, 0);
    line(ctx, 0, -outlineHeight / 2, 0, outlineHeight / 2);
    ctx.setLineDash([]);

    // Radar axes
    line(ctx, outlineWidth / 2, -outlineHeight / 2, -outlineWidth / 2, outlineHeight / 2);
    line(ctx, -outlineWidth /  2, -outlineHeight / 2, outlineWidth / 2, outlineHeight / 2);
    
    ctx.rotate(-45 * Math.PI / 180);

    let tickScale = (outlineWidth / 2 * 1.5 - 20) / 13;
    for (let j = 1; j < 13; j++) {
        let tickY = j * tickScale;
        ctx.strokeStyle = 'rgb(33, 33, 33)';
        if (j %  2 == 0) {
            line(ctx, -5, tickY, 9, tickY);
            line(ctx, -9, -tickY, 5, -tickY);
            line(ctx, tickY, -9, tickY, 5);
            line(ctx, -tickY, -5, -tickY, 9);
            ctx.fillStyle = 'rgb(33, 33, 33)';
            ctx.font = '10px Roboto';
            ctx.fillText(j, 15, tickY + 4);
            ctx.fillText(j, -15, -tickY + 4);
            ctx.fillText(j, tickY, -15);
            ctx.fillText(j, -tickY, 15 + 6);
        } else {
            line(ctx, -5, tickY, 5, tickY);
            line(ctx, -5, -tickY, 5, -tickY);
            line(ctx, tickY, -5, tickY, 5);
            line(ctx, -tickY, -5, -tickY, 5);
        }
    }

    // Radar plot
    ctx.strokeStyle = 'rgb(33, 33, 33)';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 25 / 255;
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.beginPath();
    ctx.moveTo(0, -scores.i * tickScale);
    ctx.lineTo(-scores.a * tickScale, 0);
    ctx.lineTo(0, scores.p * tickScale);
    ctx.lineTo(scores.e * tickScale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.fillStyle = 'silver';
    circle(ctx, 0, -scores.i * tickScale, 5);
    circle(ctx, -scores.a * tickScale, 0, 5);
    circle(ctx, 0, scores.p * tickScale, 5);
    circle(ctx, scores.e * tickScale, 0, 5);

    ctx.rotate(45 * Math.PI / 180);

    // Inner labels
    ctx.font = '20px Roboto';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'green';
    ctx.fillText('Integrator', -outlineWidth / 2 + 20, -outlineHeight / 2 + 30);
    ctx.fillStyle = 'blue';
    ctx.fillText('Administrator', -outlineWidth / 2 + 20, outlineHeight / 2 - 20);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'gold';
    ctx.fillText('Entrepreneur', outlineWidth / 2 - 20, -outlineHeight / 2 + 30);
    ctx.fillStyle = 'red';
    ctx.fillText('Producer', outlineWidth / 2 - 20, outlineHeight / 2 - 20);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}