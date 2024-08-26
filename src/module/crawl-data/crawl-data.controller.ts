import { ApiTags } from '@nestjs/swagger';
import { CrawlDataService } from './crawl-data.service';
import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateCrawlDataDto } from './dto/create-crawl-data.dto';
import { GetListCrawlDataDto } from './dto/get-crawl-data.dto';
import { UpdateCrawlDataDto } from './dto/update-crawl-data.dto';

@ApiTags('CrawData')
@Controller('crawl-data')
export class CrawlDataController {
    constructor(private crawlDataService: CrawlDataService) { }

    @Post('/')
    async createCrawlData(@Body() createCrawlDataDto: CreateCrawlDataDto): Promise<any> {
        return this.crawlDataService.createCrawlData(createCrawlDataDto);
    }

    @Post('/latest')
    async getCrawlData(@Body() getListCrawlDataDto: GetListCrawlDataDto) {
        return this.crawlDataService.getListCrawlData(getListCrawlDataDto);
    }

    @Put('/update')
    async updateCrawlData(@Body() updateCrawlDataDto: UpdateCrawlDataDto) {
        return this.crawlDataService.updateCrawlData(updateCrawlDataDto)
    }
}
