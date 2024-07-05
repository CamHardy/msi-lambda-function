import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createCanvas } from "canvas";

import { drawRadarPlot } from './drawRadarPlot.js';
import { drawLetters } from './drawLetters.js';
import { drawBarGraph } from './drawBarGraph.js';

//TODO: ideally move keys to .env
const s3 = new S3Client({ 
  region: 'ca-central-1' ,
  credentials: {
    accessKeyId: 'in the google doc',
    secretAccessKey: 'in the google doc'
  },
});

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  let scores = {
    p: event.p, 
    a: event.a, 
    e: event.e, 
    i: event.i
  };

  const IMAGE_WIDTH = 1000;
  const IMAGE_HEIGHT = 700;
  const RADAR_PLOT_POSITION_X = 0; // Position of the top left corner
  const RADAR_PLOT_POSITION_Y = 190;
  const RADAR_PLOT_WIDTH = 500;
  const RADAR_PLOT_HEIGHT = 500
  const LETTERS_POSITION_X = 650; // Position of the top left corner
  const LETTERS_POSITION_Y = 30;
  const LETTERS_WIDTH = 220;
  const LETTERS_HEIGHT = 150;
  const BAR_GRAPH_POSITION_X = 580; // Position of the top left corner
  const BAR_GRAPH_POSITION_Y = 430;
  const BAR_GRAPH_WIDTH = 420;
  const BAR_GRAPH_HEIGHT = 250;

  //** ----------------------------------------------------------- **//
  //** You (hopefully) shouldn't have to edit anything below here! **//
  //** ----------------------------------------------------------- **//

  let response;
  try {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");

    // fill background
    ctx.fillStyle = 'ghostwhite';
    ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    drawRadarPlot(ctx, scores, RADAR_PLOT_POSITION_X, RADAR_PLOT_POSITION_Y, RADAR_PLOT_WIDTH, RADAR_PLOT_HEIGHT);
    drawLetters(ctx, scores, LETTERS_POSITION_X, LETTERS_POSITION_Y, LETTERS_WIDTH, LETTERS_HEIGHT);
    drawBarGraph(ctx, scores, BAR_GRAPH_POSITION_X, BAR_GRAPH_POSITION_Y, BAR_GRAPH_WIDTH, BAR_GRAPH_HEIGHT);

    await s3.send(new PutObjectCommand({
      Bucket: 'msi-report-access-nwxxidjqhxxs6mhtabbttgqfnhduwcan1a-s3alias',
      Key: event.filename || 'test.png',
      Body: canvas.toBuffer('image/png')
    }));

    response = { 
      statusCode: 200, 
      body: `https://msi-report-images.s3.ca-central-1.amazonaws.com/${event.filename || 'test.png'}`
    };
  } catch (err) {
    response = { 
      statusCode: 500, 
      body: err.toString() 
    };
    console.log(err);
  }

  return response;
};
