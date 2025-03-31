# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-03-31

### Changed
- Made the package zero-dependency by making Telegram transport optional
- Moved node-telegram-bot-api to peer dependencies with optional flag
- Improved error handling when optional dependencies are not installed

## [0.2.0] - 2025-03-31

### Added
- Telegram transport for sending logs to Telegram channels/groups
- Transport system to support multiple log destinations
- Filtering capabilities for transports to selectively forward logs

### Changed
- Renamed package from "logmate" to "smartlog"
- Updated documentation with Telegram integration examples

## [0.1.0] - 2025-03-30

### Added
- Initial release
- Core logging functionality with 5 log levels (debug, info, warn, error, fatal)
- Structured JSON logging
- Pretty formatting with colors for development
- Child loggers with context inheritance
- Environment-aware configuration
- Comprehensive documentation and examples 