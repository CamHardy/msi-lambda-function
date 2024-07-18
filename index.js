import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createCanvas } from "canvas";

import { drawRadarPlot } from './drawRadarPlot.js';
import { drawLetters } from './drawLetters.js';
import { drawBarGraph } from './drawBarGraph.js';

// I know the correct way to insert credentials is to use process.env and I tried that but Amazon didn't like it. 
// Debugging why might cause my tenous grasp on sanity to slip, so here we are, hardcoding them like a noob ¯\_(ツ)_/¯
const s3 = new S3Client({ 
  region: 'ca-central-1' ,
  credentials: {
    accessKeyId: 'in the google doc',
    secretAccessKey: 'in the google doc'
  },
});

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  // Parse event.body if it exists
  let body;
  if (event.body) {
      body = JSON.parse(event.body);
  } else {
      body = event; // In case the body is directly passed
  }

  const IMAGE_WIDTH = body.imageWidth || 3360;
  const IMAGE_HEIGHT = body.imageHeight || 2331;
  const RADAR_PLOT_POSITION_X = body.radarPlotPositionX || 0; // Position of the top left corner
  const RADAR_PLOT_POSITION_Y = body.radarPlotPositionY || 621;
  const RADAR_PLOT_WIDTH = body.radarPlotWidth || 1700;
  const RADAR_PLOT_HEIGHT = body.radarPlotHeight || 1700
  const LETTERS_POSITION_X = body.lettersPositionX || 2670; // Position of the top left corner
  const LETTERS_POSITION_Y = body.lettersPositionY || 30;
  const LETTERS_WIDTH = body.lettersWidth || 660;
  const LETTERS_HEIGHT = body.lettersHeight || 450;
  const BAR_GRAPH_POSITION_X = body.barGraphPositionX || 2000; // Position of the top left corner
  const BAR_GRAPH_POSITION_Y = body.barGraphPositionY || 1721;
  const BAR_GRAPH_WIDTH = body.barGraphWidth || 1400;
  const BAR_GRAPH_HEIGHT = body.barGraphHeight || 600;

  //** ----------------------------------------------------------- **//
  //** You (hopefully) shouldn't have to edit anything below here! **//
  //** ----------------------------------------------------------- **//

  let scores = {
    p: body.p || 0, 
    a: body.a || 0, 
    e: body.e || 0, 
    i: body.i || 0
  };

  let response;
  try {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext("2d");

    // fill background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    drawRadarPlot(ctx, scores, RADAR_PLOT_POSITION_X, RADAR_PLOT_POSITION_Y, RADAR_PLOT_WIDTH, RADAR_PLOT_HEIGHT);
    drawLetters(ctx, scores, LETTERS_POSITION_X, LETTERS_POSITION_Y, LETTERS_WIDTH, LETTERS_HEIGHT);
    drawBarGraph(ctx, scores, BAR_GRAPH_POSITION_X, BAR_GRAPH_POSITION_Y, BAR_GRAPH_WIDTH, BAR_GRAPH_HEIGHT);

    await s3.send(new PutObjectCommand({
      Bucket: 'msi-report-access-nwxxidjqhxxs6mhtabbttgqfnhduwcan1a-s3alias',
      Key: body.filename || 'test.png',
      Body: canvas.toBuffer('image/png')
    }));

    response = { 
      statusCode: 200, 
      body: `https://msi-report-images.s3.ca-central-1.amazonaws.com/${body.filename || 'test.png'}`
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
