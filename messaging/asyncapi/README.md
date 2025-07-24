# Workshop with AsyncAPI
* https://github.com/asyncapi/spec/tree/master/examples

## Generate documentation
* [CLI](https://www.asyncapi.com/docs/tools/cli/installation)
* [Generator library](https://www.asyncapi.com/docs/tools/generator/installation-guide)

Install
```
$npm install -g @asyncapi/cli

$npm install @asyncapi/generator
$npm install -g @asyncapi/html-template
```

Generate
```
$asyncapi generate fromTemplate sample.yml @asyncapi/html-template@3.0.0 --use-new-generator -o ./docs
```