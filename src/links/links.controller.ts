import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('shorten')
  async shorten(
    @Body('url') url: string,
    @Headers('Authorization') token: string,
  ) {
    return this.linksService.shortenUrl(url, token);
  }

  @Get(':shortUrl')
  async redirect(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
    @Headers('Authorization') token: string,
  ) {
    const longUrl = await this.linksService.getLongUrl(shortUrl, token);

    if (longUrl) {
      return res.redirect(longUrl);
    }

    return res.status(404).send('URL não encontrada');
  }
}
