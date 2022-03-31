# GuBackUp extension

A stand-alone [Nova](https://nova.app/) extension which automatically makes backups upon saving a file, so that you cannot lose any of your code.

Every time you save a file, it will make a backup in a dedicated folder and reconstruct the folders and files tree structure.

![Example of backup structure](https://raw.githubusercontent.com/Gugu7264/GuBackUp.novaextension/4518cfb627be1fce99d85bb3144cbd5b73d3c47c/Images/backup_example.png)

## Requirements
There aren't any requirements, you just need to install the extension and you are ready to go!

If you are willing to, you can also check out the configuration.

## Configuration
### Global configuration
#### Backup directory
This is the main folder in which backups will be created.

---
### Projet-specific configuration
*Note: Due to Nova restrictions, you might not be able to set them for remote-only projects.*

#### Project backup directory
This is a folder that will be used to make backups for this project only. Overrides the global configuration.


## Bugs & Suggestions
If you encounter any bug or have any request, feel free to [open an issue](https://github.com/Gugu7264/GuBackUp.novaextension/issues/new) on the Github repository.
