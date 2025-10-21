import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Post('createNotes')
  create(@Body() createNoteDto: CreateNoteDto, @Request() req: {user: { sub: number }}) {
    return this.notesService.create(createNoteDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('getNotes')
  findAll(
    @Request() req: { user: { sub: number } },
    @Query('take', new ParseIntPipe({ optional: true })) take? : number, 
    @Query('skip', new ParseIntPipe({ optional: true })) skip? : number
  ) {
    return this.notesService.getNotes({
      take: take || 10, skip: skip || 0 },
      req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number} }
  ) {
    return this.notesService.findOneNote(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('updateNote/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: { user: { sub: number} }
  ) {
    return this.notesService.updateNote(id, updateNoteDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteNote/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number } }
  ) {
    return this.notesService.remove(id, req.user.sub);
  }
}
