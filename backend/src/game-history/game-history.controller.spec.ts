import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';

describe('GameHistoryController', () => {
  let controller: GameHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameHistoryController],
      providers: [GameHistoryService],
    }).compile();

    controller = module.get<GameHistoryController>(GameHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
