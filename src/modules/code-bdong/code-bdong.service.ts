import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CodeBdong } from './code-bdong.entity';
import { CodeBdongListDto } from './dto';

@Injectable()
export class CodeBdongService extends BaseService {
  constructor(
    @InjectRepository(CodeBdong)
    private readonly codeBdongRepo: Repository<CodeBdong>,
    @InjectEntityManager() private readonly wqEntityManager: EntityManager,
  ) {
    super();
  }

  /**
   * code bdong find
   * @param codeBdongListDto
   * @param pagination
   */
  async findAll(
    codeBdongListDto: CodeBdongListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeBdong>> {
    const qb = this.codeBdongRepo
      .createQueryBuilder('codeBdong')
      .AndWhereLike(
        'codeBdong',
        'bdongCode',
        codeBdongListDto.bdongCode,
        codeBdongListDto.exclude('bdongCode'),
      )
      .AndWhereLike(
        'codeBdong',
        'bdongName',
        codeBdongListDto.bdongName,
        codeBdongListDto.exclude('bdongName'),
      )
      .AndWhereLike(
        'codeBdong',
        'guName',
        codeBdongListDto.guName,
        codeBdongListDto.exclude('guName'),
      )
      .AndWhereLike(
        'codeBdong',
        'sidoName',
        codeBdongListDto.sidoName,
        codeBdongListDto.exclude('sidoName'),
      )
      .WhereAndOrder(codeBdongListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one
   * @param id
   */
  async findOne(id: number): Promise<CodeBdong> {
    const qb = await this.codeBdongRepo
      .createQueryBuilder('codeBdong')
      .CustomLeftJoinAndSelect(['hCodes'])
      .where('codeBdong.id = :id', { id: id })
      .getOne();

    return qb;
  }
}
