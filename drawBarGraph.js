const AXES = [
    {
        name: 'Perspective',
        poles: ['Local', 'Global'],
        weightings: [-1, -1, 1, 1]
    }, {
        name: 'Pace',
        poles: ['Slow', 'Fast'],
        weightings: [1, -1, 1, -1]
    }, {
        name: 'Approach',
        poles: ['Structured', 'Unstructured'],
        weightings: [-1, -1, 1, 1]
    }, {
        name: 'Focus',
        poles: ['Process', 'Results'],
        weightings: [1, -1, 1, -1]
    }, {
        name: 'Discussion Style',
        poles: ['Listens', 'Speaks'],
        weightings: [1, -1, 1, -1]
    }, {
        name: 'Emotionally',
        poles: ['Reserved', 'Expressive'],
        weightings: [-1, -1, 1, 1]
    }
];

const BAR_COLORS = [
    '#4d73be',
    '#7bc089'
];

function calculateWavg(p, a, e, i) {
    let sum = p + a + e + i;

    return [p / sum, a / sum, e / sum, i / sum];
}

export function drawBarGraph(ctx, scores, x, y, width, height) {
    // ctx.strokeStyle = 'pink';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(x, y, width, height);

    ctx.translate(x + width / 2, y);
    ctx.fillStyle = 'rgb(33, 33, 33)';
    ctx.font = 'bold 16px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Results', 0, 30);

    const ROW_WIDTH = 2 * width / 5;
    const ROW_HEIGHT = height / 8;

    ctx.translate(0, 2 * ROW_HEIGHT);

    // Rows
    for (let j = 0; j < AXES.length; j++) {
        // Left title
        ctx.fillStyle = 'rgb(33, 33, 33)';
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'right';
        ctx.fillText(AXES[j].name, -ROW_WIDTH, 5);

        // Left & right labels
        ctx.font = '14px Roboto';
        ctx.fillText(AXES[j].poles[0], -ROW_WIDTH / 2 - 10, 5);
        ctx.textAlign = 'left';
        ctx.fillText(AXES[j].poles[1], ROW_WIDTH / 2 + 10, 5);

        // Color bar
        let wAvgs = calculateWavg(scores.p, scores.a, scores.e, scores.i);
        let barWidth = 0;

        for (let k in wAvgs) {
            barWidth += wAvgs[k] * AXES[j].weightings[k] * (width / 2);
        }

        ctx.fillStyle = barWidth > 0 ? BAR_COLORS[1] : BAR_COLORS[0];
        ctx.fillRect(0, -ROW_HEIGHT / 2, barWidth, ROW_HEIGHT);

        // Bar outlines
        ctx.strokeStyle = 'rgb(33, 33, 33)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-ROW_WIDTH / 2, -ROW_HEIGHT / 2, ROW_WIDTH, ROW_HEIGHT);
        ctx.translate(0, ROW_HEIGHT);
    }

    // Center divider line
    ctx.strokeStyle = 'rgb(33, 33, 33)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, -ROW_HEIGHT * AXES.length - ROW_HEIGHT / 2);
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}