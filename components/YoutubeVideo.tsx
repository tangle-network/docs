import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

const YoutubeVideo = ({ id, title }: { id: string; title: string }) => {
  return <LiteYouTubeEmbed id={id} title={title} poster="maxresdefault" webp />;
};

export default YoutubeVideo;
