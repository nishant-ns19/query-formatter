// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
* @param {vscode.ExtensionContext} context
*/
function activate(context) {
	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand('query-formatter.start', function () {
		var editor=vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			if(!document)
			{
				vscode.window.showInformationMessage("No document detected");
			}
			else
			{
				const selection = editor.selection;
				const textSelection =selection.isEmpty ? document.getText() : document.getText(selection);
				if(!textSelection){
					vscode.window.showInformationMessage("Please provide some text");
				}
				else{
					console.log("Indenting Lucene Query..." );
					vscode.window.setStatusBarMessage("Indenting Lucene Query...",1000)
					try{
						var result=format(textSelection);
						if(result!==textSelection)
						{
							editor.edit(builder => builder.replace(selection.isEmpty
								? new vscode.Range(new vscode.Position(0,0),new vscode.Position(document.lineCount,0)) 
								:selection,result)).then(success =>{
									console.log("Indented successfully: "+success);
									vscode.window.showInformationMessage("Indented successfully !");
									if(selection.isEmpty){
										var postion = editor.selection.end; 
										editor.selection = new vscode.Selection(postion, postion);
									}
							});	
						}
						
					} catch (error) 
					{
						console.log("Error occurred: " + error);
						vscode.window.showInformationMessage("Unable to process text !");
					}
					
				}
			}
		}
		else
		{
			vscode.window.showInformationMessage("No editor detected");
		}
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

/**
* @param {string} query
*/
function format(query)	
{
	if(query.charAt(0)=='\"' && query.charAt(query.length-1)=='\"' && query.length>=2)
	query=query.substr(1,query.length-2);
	var result="";
	var countTabs=0;
	var inPhrase=false;
	for (let idx = 0; idx < query.length; idx++) {
		if(query.charAt(idx)=='\"')
		{
			inPhrase=!inPhrase;
			result=result+query.charAt(idx);
			if(!inPhrase)
			{
				result=result+"\n";
				for(let i=0;i<countTabs;i++)
				result=result+"\t";
			}
			continue;
		}
		if(inPhrase)
		{
			result=result+query.charAt(idx);
			continue;
		}
		if(query.charAt(idx)==' ' || query.charAt(idx)=='\t' || query.charAt(idx)=='\n' || query.charAt(idx)=='\r')
		continue;
		if(query.charAt(idx)==',')
		{
			if(result.charAt(result.length-1)=='\n')
			for(let i=0;i<countTabs;i++)
			result=result+"\t";
			result=result+query.charAt(idx);
			result=result+"\n";
			for(let i=0;i<countTabs;i++)
			result=result+"\t";
		}
		else if(query.charAt(idx)=='(' || query.charAt(idx)=='[' || query.charAt(idx)=='{')
		{
			result=result+query.charAt(idx);
			result=result+"\n";
			countTabs++;
			for(let i=0;i<countTabs;i++)
			result=result+"\t";
		}
		else if(query.charAt(idx)==')' || query.charAt(idx)==']' || query.charAt(idx)=='}')
		{
			if(result.charAt(result.length-1)=='\t')
			{
				result=result.substr(0,result.length-1);
			}
			else
			{
				result=result+"\n";
				for(let i=0;i<countTabs-1;i++)
				result=result+"\t";
			}
			countTabs--;
			result=result+query.charAt(idx);
			if((idx<(query.length-1)) && query.charAt(idx+1)==',')
			{
				continue;
			}
			result=result+"\n";
			for(let i=0;i<countTabs;i++)
			result=result+"\t";
		}
		else
		{
			result=result+query.charAt(idx);
		}
	}
	return result;
}