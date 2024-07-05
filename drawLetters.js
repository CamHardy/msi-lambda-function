const LETTERS = ['p', 'a', 'e', 'i'];

export function drawLetters(ctx, scores, x, y, width, height) {
    // ctx.strokeStyle = 'pink';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(x, y, width, height);

    // Box outline
    ctx.translate(x + width /2, y + height / 2);
    ctx.strokeStyle = 'rgb(33, 33, 33)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // Box title
    ctx.fillStyle = 'rgb(33, 33, 33)';
    ctx.font = '24px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('MSI Profile', 0, -height / 4.5);

    // Letters
    for (let l in LETTERS) {
        let letter = LETTERS[l];
        let score = scores[letter];
        ctx.font = `${Math.min(4 * score + 16, 60)}px Roboto`;

        if (score > 3) {
            letter = letter.toUpperCase();
        }

        ctx.fillText(letter, 40 * l - 60, height / 3.5);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}