import { formatCharacterInfo } from '../utils';
import GameController from '../GameController';
import Team from '../Team';

describe('formatCharacterInfo', () => {
  test('should format character info correctly', () => {
    const level = 1;
    const attack = 10;
    const defence = 40;
    const health = 50;
    const result = formatCharacterInfo(level, attack, defence, health);
    expect(result).toBe('🎖1 ⚔10 🛡40 ❤50');
  });
});

describe('GameController - onCellEnter', () => {
  let gameController;
  let gamePlayMock;

  beforeEach(() => {
    gamePlayMock = {
      showCellTooltip: jest.fn(),
      setCursor: jest.fn(),
      selectCell: jest.fn(),
      hideCellTooltip: jest.fn(),
      deselectCell: jest.fn(),
      cells: Array(64).fill().map(() => ({})),
    };
    gameController = new GameController(gamePlayMock);
    gameController.playerTeam = new Team();
    gameController.opponentTeam = new Team();
    const bowman = { level: 2, attack: 30, defence: 15, health: 50, type: 'bowman' };
    gameController.positionedCharacters = [
      {
        position: 1,
        character: bowman,
      },
    ];
    gameController.playerTeam.add(bowman); 
  });

  test('should show character info in tooltip when hovering over a cell with a character', () => {
    const index = 1;
    const character = gameController.positionedCharacters[0].character;
    const expectedTooltip = formatCharacterInfo(
      character.level,
      character.attack,
      character.defence,
      character.health
    );
    gameController.onCellEnter(index);
    expect(gamePlayMock.showCellTooltip).toHaveBeenCalledWith(expectedTooltip, index);
    expect(gamePlayMock.setCursor).toHaveBeenCalledWith('pointer');
  });
});

describe('GameController - onCellLeave', () => {
  let gameController;
  let gamePlayMock;

  beforeEach(() => {
    gamePlayMock = {
      hideCellTooltip: jest.fn(),
      deselectCell: jest.fn(),
      setCursor: jest.fn(),
    };
    gameController = new GameController(gamePlayMock);
  });

  test('should hide tooltip and reset cursor when leaving a cell', () => {
    const index = 1;
    gameController.onCellLeave(index);
    expect(gamePlayMock.hideCellTooltip).toHaveBeenCalledWith(index);
    expect(gamePlayMock.deselectCell).toHaveBeenCalledWith(index);
    expect(gamePlayMock.setCursor).toHaveBeenCalledWith('auto');
  });
});
