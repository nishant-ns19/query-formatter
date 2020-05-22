// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
* @param {vscode.ExtensionContext} context
*/
function activate(context) 
{
	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand('query-formatter.start', function () {
		var editor=vscode.window.activeTextEditor;
		if (editor)
		{
			//Retrieve current document
			const document = editor.document;
			if(!document)
			{
				vscode.window.showInformationMessage("No document detected");
			}
			else
			{
				//Get selecton object
				const selection = editor.selection;
				//Get selected text and if nothing is selected, everything is retrieved
				const textSelection =selection.isEmpty ? document.getText() : document.getText(selection);
				if(!textSelection)
				{
					vscode.window.showInformationMessage("Please provide some text");
				}
				else
				{
					console.log("Indenting Lucene Query..." );
					vscode.window.setStatusBarMessage("Indenting Lucene Query...",1000)
					try
					{
						//Formet the query
						var result=format(textSelection);
						if(result!==textSelection)
						{
							//Use editor object to replace the text
							editor.edit(builder => builder.replace(selection.isEmpty
								? new vscode.Range(new vscode.Position(0,0),new vscode.Position(document.lineCount,0))
								:selection,result)).then(success =>{
								console.log("Indented successfully: "+success);
								vscode.window.showInformationMessage("Indented successfully !");
								//If nothing was selected by the user,deselect everything my moving cursor to the end after replacing th text
								if(selection.isEmpty)
								{
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
	//Omit spaces around the query
	query=removeSpace(query)
	//Remove "" around the query
	if(query.charAt(0)=='\"' && query.charAt(query.length-1)=='\"' && query.length>=2)	
	{	
		query=query.substr(1,query.length-2);
	}
	var result="";
	var tabCount=0;
	//inPhrase signifies if we are traversing the quoted text
	var inPhrase=false;
	for (let idx = 0; idx < query.length; idx++)
	{
		//toggle inPhrase when " is encountered
		if(query.charAt(idx)=='\"')
		{
			//toggle inPhrase
			inPhrase=!inPhrase;
			result=result+query.charAt(idx);
			//Jump onto new line after completing each phrase(quoted text)
			if(!inPhrase)
			{
				result=result+"\n";
				result=result+"\t".repeat(tabCount);
			}
			continue;
		}
		//quoted text should be printed as it is
		if(inPhrase)
		{
			result=result+query.charAt(idx);
			//in case quoted text contains newline character, cursor should move onto next block but should not change the current block
			if(query.charAt(idx)=='\n')
			{
				result=result+"\t".repeat(tabCount);
			}
			continue;
		}
		//Omit exisiting spacing characters from the string
		if(query.charAt(idx)==' ' || query.charAt(idx)=='\t' || query.charAt(idx)=='\n' || query.charAt(idx)=='\r')
		{
			continue;
		}
		//Handling ',' separately
		if(query.charAt(idx)==',')
		{
			//Incase cursor is at the starting of a new line, add tab spacing to get into the current block
			if(result.charAt(result.length-1)=='\n')
			{
				result=result+"\t".repeat(tabCount);
			}
			//append ','
			result=result+query.charAt(idx);
			//Jump onto new line and respective indent block after each ','
			result=result+"\n";
			result=result+"\t".repeat(tabCount);
		}
		//Start a new block whenever an opening paranthesis is encountered
		else if(query.charAt(idx)=='(' || query.charAt(idx)=='[' || query.charAt(idx)=='{')
		{
			result=result+query.charAt(idx);
			//Jump onto new line
			result=result+"\n";
			//Add a new block by increasing number of tabs
			tabCount++;
			result=result+"\t".repeat(tabCount);
		}
		//End the current block whenever a closing paranthesis is encountered
		else if(query.charAt(idx)==')' || query.charAt(idx)==']' || query.charAt(idx)=='}')
		{
			//If the cursor has already moved onto the next line, remove '\t' from end as cursor needs to go back to the previous block
			if(result.charAt(result.length-1)=='\t')
			{
				result=result.substr(0,result.length-1);
			}
			//otherwise, move onto the next line, get onto the preivous block
			else
			{
				result=result+"\n";
				result=result+"\t".repeat(tabCount-1);
			}
			// decrement tabCount due to closing of the block
			tabCount--;
			result=result+query.charAt(idx);
			//incase there is a ',' after closing a block, it has to be printed just after closing so continue without moving onto the next line
			if((idx<(query.length-1)) && query.charAt(idx+1)==',')
			{
				continue;
			}
			//otherwise, move onto the next line, jump onto the current block
			result=result+"\n";
			result=result+"\t".repeat(tabCount);
		}
		//in any other case, just print the character
		else
		{
			result=result+query.charAt(idx);
		}
	}
	return result;
}

/**
* @param {string} query
*/
function removeSpace(query)
{
	var l=0,r=query.length-1
	//Remove space characters from starting
	while(l<query.length && (query[l]==' ' || query[l]=='\r' || query[l]=='\t' || query[l]=='\n'))
	{
		l++;
	}
	//Remove space characters from end
	while(r>=0 && (query[r]==' ' || query[r]=='\r' || query[r]=='\t' || query[r]=='\n'))
	{
		r--;
	}
	if(l>r)
	{
		return "";
	}
	return query.substr(l,r-l+1)
}