declare module '@flat/midijs' {
  import { Driver } from '@flat/midijs/lib/connect/driver';
  import { Input } from '@flat/midijs/lib/connect/input';
  import { Output } from '@flat/midijs/lib/connect/output';
  import { File } from '@flat/midijs/lib/file';
  import { Track } from '@flat/midijs/lib/file/track';
  import { Event, MetaEvent, SysexEvent, ChannelEvent } from '@flat/midijs/lib/file/event';
  import { Header } from '@flat/midijs/lib/file/header';

  export {
      Driver,
      Input,
      Output,
      File,
      Track,
      Event,
      MetaEvent,
      SysexEvent,
      ChannelEvent,
      Header,
  };
}

declare module '@flat/midijs/lib/gm' {
  /**
   * Check if a program is in a family of instruments.
   * @param program The program number to test.
   * @param family The family name to check against.
   * @returns Whether the program belongs to the specified family.
   */
  function checkFamily(program: number, family: string): boolean;

  /**
   * Fetch the MIDI program number of an instrument, only if it belongs to a specified family.
   * @param instrument The name of the instrument.
   * @param family Optional family name to filter the instruments.
   * @returns The MIDI program number or false if not found or does not belong to the family.
   */
  export function getProgram(instrument: string, family?: string): number | false;

  /**
   * Fetch the name of the instrument corresponding to a MIDI program number, only if it belongs to a specified family.
   * @param program The MIDI program number.
   * @param family Optional family name to filter the instruments.
   * @returns The name of the instrument or false if not found or does not belong to the family.
   */
  export function getInstrument(program: number, family?: string): string | false;

  /**
   * Fetch the family name of an instrument or a program.
   * @param instrumentOrProgram The instrument name or program number.
   * @returns The family name or false if not found.
   */
  export function getFamily(instrumentOrProgram: number | string): string | false;
}



declare module '@flat/midijs/lib/connect' {
  import { Driver } from '@flat/midijs/lib/connect/driver';
  import { Input } from '@flat/midijs/lib/connect/input';
  import { Output } from '@flat/midijs/lib/connect/output';

  /**
   * Establish a connection to the MIDI driver.
   * @returns A promise that resolves to an instance of the Driver.
   */
  function connect(): Promise<Driver>;

  /**
   * Reference to the Driver class from connect/driver module.
   */
  export { Driver };

  /**
   * Reference to the Input class from connect/input module.
   */
  export { Input };

  /**
   * Reference to the Output class from connect/output module.
   */
  export { Output };
}

declare module '@flat/midijs/lib/connect/input' {
  import { EventEmitter } from 'events';
  import { ChannelEvent } from '@flat/midijs/lib/file/event';

  /**
   * Represents a MIDI input device that handles incoming MIDI messages.
   */
  class Input extends EventEmitter {
      constructor(native: MIDIInput);

      native: MIDIInput;
      id: string;
      manufacturer: string;
      name: string;
      version: string;

      /**
       * Event handler that processes incoming MIDI messages and emits parsed events.
       */
      private onMIDIMessage(event: any): void;
  }
}

declare module '@flat/midijs/lib/connect/output' {
  import { ChannelEvent } from '@flat/midijs/lib/file/event';

  /**
   * Represents a MIDI output device that handles outgoing MIDI messages.
   */
  class Output {
      constructor(native: MIDIOutput);

      native: MIDIOutput;
      id: string;
      manufacturer: string;
      name: string;
      version: string;

      /**
       * Sends a MIDI event to the connected MIDI output device.
       * @param event The MIDI event to send.
       */
      send(event: ChannelEvent): void;
  }
}


declare module '@flat/midijs/lib/connect/driver' {
  import { EventEmitter } from 'events';
  import { Output } from '@flat/midijs/lib/connect/output';
  import { Input } from '@flat/midijs/lib/connect/input';
  import { ChannelEvent } from '@flat/midijs/lib/file/event';

  /**
   * Represents the MIDI driver that handles connections to MIDI devices.
   */
  class Driver extends EventEmitter {
      constructor(native: MIDIAccess);

      native: MIDIAccess;
      outputs: Output[];
      inputs: Input[];
      output: Output | null;
      input: Input | null;

      /**
       * Sets the specified input as the default input.
       * @param input The input identifier or instance to set as default.
       */
      setInput(input: Input | MIDIInput | string): void;

      /**
       * Sets the specified output as the default output.
       * @param output The output identifier or instance to set as default.
       */
      setOutput(output: Output | MIDIOutput | string): void;

      /**
       * Sends a MIDI event through the default output.
       * @param event The MIDI event to send.
       */
      send(event: ChannelEvent): void;

      /**
       * Internal method to transmit MIDI events received from the default input.
       * @param event The MIDI event to transmit.
       */
      private _transmitMIDIEvent(event: ChannelEvent): void;
  }
}




declare module '@flat/midijs/lib/error' {
  /**
   * Error thrown during MIDI parsing process.
   */
  class MIDIParserError extends Error {
      constructor(actual: any, expected: any, byte?: number);
      actual: any;
      expected: any;
      byte?: number;
  }

  /**
   * Error thrown during MIDI encoding process.
   */
  class MIDIEncoderError extends Error {
      constructor(actual: any, expected: any);
      actual: any;
      expected: any;
  }

  /**
   * Error thrown when an invalid MIDI event is encountered.
   */
  class MIDIInvalidEventError extends Error {
      constructor(message: string);
  }

  /**
   * Generic error for invalid arguments.
   */
  class MIDIInvalidArgument extends Error {
      constructor(message: string);
  }

  /**
   * Error thrown when a non-MIDI file is processed.
   */
  class MIDINotMIDIError extends Error {
      constructor();
  }

  /**
   * Error thrown when a MIDI feature is not supported.
   */
  class MIDINotSupportedError extends Error {
      constructor(message: string);
  }
}



declare module '@flat/midijs/lib/file' {
  import { Duplex } from 'stream';
  import { Header } from '@flat/midijs/lib/file/header';
  import { Event, MetaEvent, SysexEvent, ChannelEvent } from '@flat/midijs/lib/file/event';
  import { Track } from '@flat/midijs/lib/file/track';

  /**
   * Represents a MIDI file which can parse and encode MIDI data.
   */
  class File extends Duplex {
      constructor(data?: Buffer, callback?: (err?: Error, data?: Buffer) => void);

      /**
       * Set the MIDI data for this file.
       * @param data The Buffer containing MIDI data.
       * @param callback Optional callback for operation completion.
       */
      setData(data: Buffer, callback?: (err?: Error, data?: Buffer) => void): void;

      /**
       * Get the MIDI data from this file.
       * @param callback Callback to receive the MIDI data.
       */
      getData(callback: (err: Error | null, data: Buffer) => void): void;

      /**
       * Get the header of the MIDI file.
       */
      getHeader(): Header;

      /**
       * Get all tracks from the MIDI file.
       */
      getTracks(): Track[];

      /**
       * Get a specific track by index.
       * @param index The index of the track.
       */
      getTrack(index: number): Track | undefined;

      /**
       * Add a track to the MIDI file.
       * @param index The index at which to add the track, or the events if no index is provided.
       * @param events The events to include in the track, if index is specified.
       */
      addTrack(index: number | Event[], events?: Event[]): File;

      /**
       * Remove a track from the MIDI file.
       * @param index The index of the track to remove. Defaults to the last track.
       */
      removeTrack(index?: number): File;

      static Header: typeof Header;
      static Event: typeof Event;
      static MetaEvent: typeof MetaEvent;
      static SysexEvent: typeof SysexEvent;
      static ChannelEvent: typeof ChannelEvent;
      static Track: typeof Track;
  }
}



declare module '@flat/midijs/lib/file/track' {
  import { Event } from '@flat/midijs/lib/file/event';

  /**
   * Represents a single track in a MIDI file.
   */
  class Track {
      constructor(events: Event[]);

      /**
       * Get all events in this track.
       * @returns An array of MIDI events.
       */
      getEvents(): Event[];

      /**
       * Get a specific event by index.
       * @param index The index of the event.
       * @returns The event or undefined if the index is out of range.
       */
      getEvent(index: number): Event | undefined;

      /**
       * Add an event to this track.
       * @param index The index at which to add the event or the event itself if no second parameter is provided.
       * @param event The event to add, if an index is specified.
       * @returns The current instance of this track.
       */
      addEvent(index: number | Event, event?: Event): Track;

      /**
       * Remove an event from this track.
       * @param index The index of the event to remove. Defaults to the last event.
       * @returns The current instance of this track.
       */
      removeEvent(index?: number): Track;
  }
}


declare module '@flat/midijs/lib/file/event' {
  /**
   * Abstract base class for MIDI events.
   */
  abstract class Event {
      constructor(specs?: any, defaults?: any, delay?: number);
      delay: number;
  }

  /**
   * Represents a meta event in MIDI which is not transmitted to MIDI devices.
   */
  class MetaEvent extends Event {
    constructor(type: number, specs?: object, delay?: number);
    static TYPE: {
      SEQUENCE_NUMBER: number;
      SEQUENCE_NAME: number;
      MIDI_CHANNEL: number;
      INSTRUMENT_NAME: number;
      TEXT: number;
      SET_TEMPO: number;
      TIME_SIGNATURE: number;
      KEY_SIGNATURE: number;
      END_OF_TRACK: number;
    };
    type: number;
    data: number[];
    time: number;
  }

  /**
   * Represents a system exclusive event in MIDI.
   */
  class SysexEvent extends Event {
      constructor(data: Uint8Array);
      data: Uint8Array;
  }

  /**
   * Represents a channel-specific MIDI event.
   */
  class ChannelEvent extends Event {
    constructor(type: number, specs: object, channel: number, delay?: number);
    static TYPE: {
      NOTE_OFF: number;
      NOTE_ON: number;
      KEY_AFTERTOUCH: number;
      CONTROLLER: number;
      PROGRAM_CHANGE: number;
      CHANNEL_AFTERTOUCH: number;
      PITCH_BEND: number;
    };
    type: number;
    channel: number;
    param1: number;
    param2: number;
    time: number;
  }
}


declare module '@flat/midijs/lib/file/header' {
  /**
   * Represents the header of a Standard MIDI file.
   */
  class Header {
      constructor(fileType: number, trackCount: number, ticksPerBeat: number);

      /**
       * Get the MIDI file type.
       * @returns The MIDI file type.
       */
      getFileType(): number;

      /**
       * Get the number of ticks per beat.
       * @returns The ticks per beat.
       */
      getTicksPerBeat(): number;

      /**
       * Set the MIDI file type.
       * @param fileType The MIDI file type.
       * @throws {MIDIInvalidArgument} If the file type is undefined.
       */
      setFileType(fileType: number): Header;

      /**
       * Set the number of ticks per beat.
       * @param ticksPerBeat The number of ticks per beat.
       * @throws {MIDIInvalidArgument} If the ticks per beat amount is invalid.
       */
      setTicksPerBeat(ticksPerBeat: number): Header;
  }

  /**
   * Enumeration of possible MIDI file types.
   */
  namespace Header {
      enum FILE_TYPE {
          SINGLE_TRACK = 0,
          SYNC_TRACKS = 1,
          ASYNC_TRACKS = 2
      }
  }
}



declare module '@flat/midijs/lib/file/encoder/track' {
  import { Track } from '@flat/midijs/lib/file/track';
  import { Buffer } from 'buffer';

  /**
   * Encode a MIDI track into a Buffer.
   * @param track The Track object to encode.
   * @returns The encoded track as a Buffer.
   */
  export function encodeTrack(track: Track): Buffer;
}



declare module '@flat/midijs/lib/file/encoder/chunk' {
  import { Buffer } from 'buffer';

  /**
   * Encode a MIDI chunk.
   * @param type The type of the chunk (e.g., 'MTrk').
   * @param data The data to include in the chunk.
   * @returns The encoded chunk as a Buffer.
   */
  export function encodeChunk(type: string, data: Buffer): Buffer;
}



declare module '@flat/midijs/lib/file/encoder/event' {
  import { Buffer } from 'buffer';
  import { Event, MetaEvent, SysexEvent, ChannelEvent } from '@flat/midijs/lib/file/event';

  /**
   * Encode an integer as a variable-length integer used in MIDI data.
   * @param value The integer to encode.
   * @returns The encoded variable-length integer as a Buffer.
   */
  export function encodeVarInt(value: number): Buffer;

  /**
   * Encode a meta MIDI event.
   * @param event The MetaEvent to encode.
   * @returns The encoded meta event as a Buffer.
   */
  export function encodeMetaEvent(event: MetaEvent): Buffer;

  /**
   * Encode a system exclusive MIDI event.
   * @param event The SysexEvent to encode.
   * @returns The encoded sysex event as a Buffer.
   */
  export function encodeSysexEvent(event: SysexEvent): Buffer;

  /**
   * Encode a channel MIDI event.
   * @param event The ChannelEvent to encode.
   * @returns The encoded channel event as a Buffer.
   */
  export function encodeChannelEvent(event: ChannelEvent): Buffer;

  /**
   * Encode any MIDI event.
   * @param event The Event to encode.
   * @param runningStatus Optional running status to optimize the MIDI data stream.
   * @returns An object with the encoded data and the new running status.
   */
  export function encodeEvent(event: Event, runningStatus?: number): { data: Buffer, runningStatus: number };
}



declare module '@flat/midijs/lib/file/parser/track' {
  import { BufferCursor } from 'buffercursor';
  import { Track } from '@flat/midijs/lib/file/track';

  /**
   * Parse a MIDI track from a buffer cursor.
   * @param cursor The BufferCursor to parse the track from.
   * @returns The parsed Track object.
   */
  export function parseTrack(cursor: BufferCursor): Track;
}



declare module '@flat/midijs/lib/file/parser/chunk' {
  import { BufferCursor } from 'buffercursor';
  import { MIDIParserError } from '@flat/midijs/lib/error';

  /**
   * Parse a MIDI chunk from a buffer cursor.
   * @param expected The expected type of the chunk (e.g., 'MTrk').
   * @param cursor The BufferCursor to parse the chunk from.
   * @throws {MIDIParserError} If the actual chunk type does not match the expected type.
   * @returns The BufferCursor positioned at the chunk data.
   */
  export function parseChunk(expected: string, cursor: BufferCursor): BufferCursor;
}



declare module '@flat/midijs/lib/file/parser/event' {
  import { BufferCursor } from 'buffercursor';
  import { Event, MetaEvent, SysexEvent, ChannelEvent } from '@flat/midijs/lib/file/event';
  import { MIDIParserError } from '@flat/midijs/lib/error';

  /**
   * Parse a variable-length integer from the buffer cursor.
   * @param cursor The buffer cursor to read from.
   * @returns The parsed integer.
   */
  export function parseVarInt(cursor: BufferCursor): number;

  /**
   * Parse a meta MIDI event from the buffer cursor.
   * @param delay The delay of the event in ticks.
   * @param cursor The buffer cursor to parse from.
   * @returns The parsed MetaEvent.
   */
  export function parseMetaEvent(delay: number, cursor: BufferCursor): MetaEvent;

  /**
   * Parse a system exclusive MIDI event from the buffer cursor.
   * @param delay The delay of the event in ticks.
   * @param type The event type indicator (0xF0 or 0xF7).
   * @param cursor The buffer cursor to parse from.
   * @returns The parsed SysexEvent.
   */
  export function parseSysexEvent(delay: number, type: number, cursor: BufferCursor): SysexEvent;

  /**
   * Parse a channel MIDI event from the buffer cursor.
   * @param delay The delay of the event in ticks.
   * @param type The event type indicator.
   * @param channel The MIDI channel.
   * @param cursor The buffer cursor to parse from.
   * @returns The parsed ChannelEvent.
   */
  export function parseChannelEvent(delay: number, type: number, channel: number, cursor: BufferCursor): ChannelEvent;

  /**
   * Parse any type of MIDI event from the buffer cursor.
   * @param cursor The buffer cursor to parse from.
   * @param runningStatus Optional running status to optimize the data stream.
   * @returns An object with the parsed event and the new running status.
   */
  export function parseEvent(cursor: BufferCursor, runningStatus?: number): { event: Event, runningStatus: number };
}

/**
 * FIXME: To be removed once added to @types/buffercursor
 */
declare module 'buffercursor' {
  import { Buffer } from 'buffer';
  import VError from 'verror';

  /**
   * Custom error type for buffer cursor overflows.
   */
  class BufferCursorOverflow extends VError {
      kind: string;
      length: number;
      position: number;
      size: number;

      constructor(length: number, position: number, size: number);
  }

  /**
   * A cursor for reading from and writing to a buffer.
   */
  class BufferCursor {
      constructor(buff: Buffer, noAssert?: boolean);

      buffer: Buffer;
      length: number;

      seek(pos: number): BufferCursor;
      eof(): boolean;
      tell(): number;
      slice(length?: number): BufferCursor;
      toString(encoding?: BufferEncoding, length?: number): string;

      readUInt8(): number;
      readInt8(): number;
      readInt16BE(): number;
      readInt16LE(): number;
      readUInt16BE(): number;
      readUInt16LE(): number;
      readUInt32LE(): number;
      readUInt32BE(): number;
      readInt32LE(): number;
      readInt32BE(): number;
      readFloatBE(): number;
      readFloatLE(): number;
      readDoubleBE(): number;
      readDoubleLE(): number;

      write(value: string, length?: number, encoding?: BufferEncoding): BufferCursor;
      fill(value: any, length?: number): BufferCursor;
      copy(source: Buffer | BufferCursor, sourceStart?: number, sourceEnd?: number): BufferCursor;

      writeUInt8(value: number): BufferCursor;
      writeInt8(value: number): BufferCursor;
      writeUInt16BE(value: number): BufferCursor;
      writeUInt16LE(value: number): BufferCursor;
      writeInt16BE(value: number): BufferCursor;
      writeInt16LE(value: number): BufferCursor;
      writeUInt32BE(value: number): BufferCursor;
      writeUInt32LE(value: number): BufferCursor;
      writeInt32BE(value: number): BufferCursor;
      writeInt32LE(value: number): BufferCursor;
      writeFloatBE(value: number): BufferCursor;
      writeFloatLE(value: number): BufferCursor;
      writeDoubleBE(value: number): BufferCursor;
      writeDoubleLE(value: number): BufferCursor;
  }
}
