const genFfmpegFormatConfigs = (url, port) =>
  ["-loglevel", "panic", "-i", url, '-preset', 'ultrafast', '-crf', '51', '-tune', 'zerolatency', '-f', 'mpegts', '-codec:v', 'mpeg1video', '-b:v', '800k', '-r', '30', '-muxdelay', '0.4', `http://localhost:${port}/s1`];

module.exports = {genFfmpegFormatConfigs}
