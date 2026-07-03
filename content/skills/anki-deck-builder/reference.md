# Anki import format reference

# Anki import format

Anki imports plain text with one card per line, fields separated by a tab character, no header row.

```
Front text<TAB>Back text
```

Use `<br>` inside a field for a line break within one side of the card. Wrap the whole field in quotes only if it contains a literal tab or newline. Tags are added separately after import via Anki's browser, not embedded in the file.
