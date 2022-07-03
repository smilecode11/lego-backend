import { parse, join, extname } from 'path';
import { nanoid } from 'nanoid';
import { Controller } from 'egg';
import * as sharp from 'sharp';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import * as streamWormhole from 'stream-wormhole';

export default class UtilsController extends Controller {
  async uploadToOSS() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    //  smiling-logo-backend /imooc-test/**.ext
    const savedOSSPath = join('imooc-test', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(savedOSSPath, stream);
      const { url, name } = result;
      ctx.helper.success({ ctx, res: { name, url } });
    } catch (error) {
      await streamWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }
  }

  async uploads() {
    const { ctx, app } = this;
    const file = ctx.request.files[0];
    const { filepath } = file;
    //  生成 sharp 实例
    const imageSource = sharp(filepath);
    const metaData = await imageSource.metadata();
    let thumbnailUrl = '';
    //  检查图片宽度大于 300, 进行压缩生成缩略图, 保存格式 /uploads/**/abc-thumbnail.png
    if (metaData.width && metaData.width > 300) {
      const { ext, name, dir } = parse(filepath);
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`); //  生成缩略图保存路径
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath); // 设置宽度 300 等比缩放, 并转化为文件进行保存
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
    }
    const url = file.filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } });
  }

  /** 本地路径转化为站点可访问路径*/
  pathToURL(path: string) {
    const { app } = this;
    return path.replace(app.config.baseDir, app.config.baseUrl);
  }

  async fileUploadByStream() {
    const { ctx, app } = this;
    const stream = await ctx.getFileStream();
    const uid = nanoid(6);
    const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname(stream.filename));
    const thumbnailFilePath = join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));
    const target = createWriteStream(saveFilePath);
    const thumbTarget = createWriteStream(thumbnailFilePath);
    //  pipeline promise 版本进行流的操作
    const savePromise = pipeline(stream, target);
    const transformer = sharp().resize({ width: 300 }); //  使用 sharp 创建一个转换流
    const saveThumbPromise = pipeline(stream, transformer, thumbTarget);
    try {
      await Promise.all([ savePromise, saveThumbPromise ]);
    } catch (error) {
      return ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }
    ctx.helper.success({ ctx, res: { url: this.pathToURL(saveFilePath), thumbnailUrl: this.pathToURL(thumbnailFilePath) } });
  }
}
