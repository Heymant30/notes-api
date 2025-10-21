import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class NotesService {
  private logger = new Logger(NotesService.name)
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const note = await this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        body: createNoteDto.body,
        userId
      }
    })
    
    this.logger.log(`New note created with id : ${note.id}`)
    return note
  }

  async getNotes({ skip, take }: { skip: number, take: number}, userId: number) {
    const notes = await this.prismaService.note.findMany({
      where: {
        userId
      },
      skip,
      take
    })
    return notes;
  }

  async findOneNote(id: number, userId: number) {

    const note = await this.prismaService.note.findFirst({
      where: {
        id
      }
    })
    if(!note){
      throw new NotFoundException('Not Found')
    }
    if(note?.userId !==  userId) {
      throw new ForbiddenException('Not Allowed')
    }
    return note;
  }

  async updateNote(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.prismaService.note.findFirst({
      where: {
        id
      }
    })
    if(!note){
      throw new NotFoundException('Not Found')
    }
    if(note?.userId !==  userId) {
      throw new ForbiddenException('Not Allowed')
    }
    const res = await this.prismaService.note.update({
      data: updateNoteDto,
      where: {
        id
      }
    })
    return res;
  }

  async remove(id: number, userId: number) {

    const note = await this.prismaService.note.findFirst({
      where: {
        id
      }
    })
    if(!note){
      throw new NotFoundException('Not Found')
    }
    if(note?.userId !==  userId) {
      throw new ForbiddenException('Not Allowed')
    }
    const res = await this.prismaService.note.delete({
      where: {
        id
      }
    })
    return res;
  }
}
