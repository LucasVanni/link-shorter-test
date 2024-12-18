import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LinksService } from './links.service';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

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

  @Get('analytics/:shortUrl')
  async getLinkAnalytics(
    @Param('shortUrl') shortUrl: string,
    @Headers('Authorization') token: string,
  ) {
    return this.linksService.getLinkAnalytics(shortUrl, token);
  }

  @Get('')
  async getLinks(@Headers('Authorization') token: string) {
    return this.linksService.getLinks(token);
  }

  @Post('shorten')
  async shorten(
    @Headers('host') host: string,
    @Headers('Authorization') token: string,
    @Body('url') url: string,
  ) {
    return this.linksService.shortenUrl(url, token, host);
  }

  @Patch(':shortUrl')
  async updateLink(
    @Body('longUrl') longUrl: string,
    @Param('shortUrl') shortUrl: string,
    @Headers('Authorization') token: string,
  ) {
    return this.linksService.updateLink(longUrl, shortUrl, token);
  }

  @Delete(':shortUrl')
  async deleteLink(
    @Param('shortUrl') shortUrl: string,
    @Headers('Authorization') token: string,
  ) {
    return this.linksService.deleteLink(shortUrl, token);
  }
}
