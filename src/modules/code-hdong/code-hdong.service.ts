import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongListDto } from './dto';

@Injectable()
export class CodeHdongService extends BaseService {
  constructor(
    @InjectRepository(CodeHdong)
    private readonly codeHdongRepo: Repository<CodeHdong>,
  ) {
    super();
  }

  async findAll(
    codeHdongListDto: CodeHdongListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeHdong>> {
    const qb = this.codeHdongRepo
      .createQueryBuilder('codeHdong')
      .AndWhereLike(
        'codeHdong',
        'hdongCode',
        codeHdongListDto.hdongCode,
        codeHdongListDto.exclude('hdongCode'),
      )
      .AndWhereLike(
        'codeHdong',
        'hdongName',
        codeHdongListDto.hdongName,
        codeHdongListDto.exclude('hdongName'),
      )
      .AndWhereLike(
        'codeHdong',
        'guName',
        codeHdongListDto.guName,
        codeHdongListDto.exclude('guName'),
      )
      .AndWhereLike(
        'codeHdong',
        'sidoName',
        codeHdongListDto.sidoName,
        codeHdongListDto.exclude('sidoName'),
      )
      .WhereAndOrder(codeHdongListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one
   * @param id
   */
  async findOne(id: number): Promise<CodeHdong> {
    const qb = await this.codeHdongRepo
      .createQueryBuilder('codeHdong')
      .CustomLeftJoinAndSelect(['bCodes'])
      .where('codeHdong.id = :id', { id: id })
      .getOne();

    return qb;
  }
}
