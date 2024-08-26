import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommonLogger } from '../../share/common/logger/common.logger';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CrawlData } from 'src/module/crawl-data/entities/crawl-data.entity';
import { CreateCrawlDataDto } from './dto/create-crawl-data.dto';
import { crawl_data_error } from './crawl-data.constant';
import { CrawlDataStatus } from './enum/type.enum';
import { GetListCrawlDataDto } from './dto/get-crawl-data.dto';
import { UpdateCrawlDataDto } from './dto/update-crawl-data.dto';

@Injectable()
export class CrawlDataService {
	constructor(
		@InjectRepository(CrawlData)
		private readonly crawData: Repository<CrawlData>,
	) {}

	/**
	 * @description This is function create new crawl data.
	 * @param createCrawlDataDto
	 */
	public async createCrawlData(createCrawlDataDto: CreateCrawlDataDto): Promise<any> {
		try {
			const { member_id, information, type } = createCrawlDataDto;
			const phoneNumber = String(information.phone_number);

			const member = await this.crawData.findOne({ member_id, type, phone_number: phoneNumber });
			if (member) throw new HttpException(crawl_data_error.PHONE_NUMBER_IS_EXIST, HttpStatus.BAD_REQUEST);

			const data = this.crawData.create({
				member_id,
				type,
				phone_number: phoneNumber,
				status: CrawlDataStatus.UN_CREATE,
			});

			return await this.crawData.save(data);
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_CREATE_CRAWL_DATA_SERVICE_`, error);
			throw error;
		}
	}

	/**
	 * @description This is function get list crawl data by type.
	 * @param getListCrawlDataDto
	 */
	public async getListCrawlData(getListCrawlDataDto: GetListCrawlDataDto): Promise<any> {
		try {
			const { type } = getListCrawlDataDto;
			return await this.crawData
				.createQueryBuilder('crawl_data')
				.where('crawl_data.type = :type', { type })
				.andWhere('crawl_data.status = :status', { status: CrawlDataStatus.UN_CREATE })
				.orderBy('id', 'DESC')
				.getOne();
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_GET_CRAWL_DATA_SERVICE_`, error);
			throw error;
		}
	}

	/**
	 * @description This is function update crawl data.
	 * @param updateCrawlDataDto
	 */
	public async updateCrawlData(updateCrawlDataDto: UpdateCrawlDataDto): Promise<any> {
		try {
			const { crawl_data_ids } = updateCrawlDataDto;
			if (crawl_data_ids.length <= 0) return false;

			return await this.crawData.update({ id: In(crawl_data_ids) }, { status: CrawlDataStatus.CREATED });
		} catch (error) {
			CommonLogger.log(`${new Date().toDateString()}_ERRORS_UPDATE_CRAWL_DATA_SERVICE_`, error);
			throw error;
		}
	}
}
