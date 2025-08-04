import{a as i}from"./_commonjsHelpers-DsqdWQfm.js";function c(r,s){for(var e=0;e<s.length;e++){const t=s[e];if(typeof t!="string"&&!Array.isArray(t)){for(const n in t)if(n!=="default"&&!(n in r)){const a=Object.getOwnPropertyDescriptor(t,n);a&&Object.defineProperty(r,n,a.get?a:{enumerable:!0,get:()=>t[n]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}};(function(r,s){ace.define("ace/snippets/sqlserver.snippets",["require","exports","module"],function(e,t,n){n.exports=`# ISNULL
snippet isnull
	ISNULL(\${1:check_expression}, \${2:replacement_value})
# FORMAT
snippet format
	FORMAT(\${1:value}, \${2:format})
# CAST
snippet cast
	CAST(\${1:expression} AS \${2:data_type})
# CONVERT
snippet convert
	CONVERT(\${1:data_type}, \${2:expression})
# DATEPART
snippet datepart
	DATEPART(\${1:datepart}, \${2:date})
# DATEDIFF
snippet datediff
	DATEDIFF(\${1:datepart}, \${2:startdate}, \${3:enddate})
# DATEADD
snippet dateadd
	DATEADD(\${1:datepart}, \${2:number}, \${3:date})
# DATEFROMPARTS 
snippet datefromparts
	DATEFROMPARTS(\${1:year}, \${2:month}, \${3:day})
# OBJECT_DEFINITION
snippet objectdef
	SELECT OBJECT_DEFINITION(OBJECT_ID('\${1:sys.server_permissions /*object name*/}'))
# STUFF XML
snippet stuffxml
	STUFF((SELECT ', ' + \${1:ColumnName}
		FROM \${2:TableName}
		WHERE \${3:WhereClause}
		FOR XML PATH('')), 1, 1, '') AS \${4:Alias}
	\${5:/*https://msdn.microsoft.com/en-us/library/ms188043.aspx*/}
# Create Procedure
snippet createproc
	-- =============================================
	-- Author:		\${1:Author}
	-- Create date: \${2:Date}
	-- Description:	\${3:Description}
	-- =============================================
	CREATE PROCEDURE \${4:Procedure_Name}
		\${5:/*Add the parameters for the stored procedure here*/}
	AS
	BEGIN
		-- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.
		SET NOCOUNT ON;
		
		\${6:/*Add the T-SQL statements to compute the return value here*/}
		
	END
	GO
# Create Scalar Function
snippet createfn
	-- =============================================
	-- Author:		\${1:Author}
	-- Create date: \${2:Date}
	-- Description:	\${3:Description}
	-- =============================================
	CREATE FUNCTION \${4:Scalar_Function_Name}
		-- Add the parameters for the function here
	RETURNS \${5:Function_Data_Type}
	AS
	BEGIN
		DECLARE @Result \${5:Function_Data_Type}
		
		\${6:/*Add the T-SQL statements to compute the return value here*/}
		
	END
	GO`}),ace.define("ace/snippets/sqlserver",["require","exports","module","ace/snippets/sqlserver.snippets"],function(e,t,n){t.snippetText=e("./sqlserver.snippets"),t.scope="sqlserver"}),function(){ace.require(["ace/snippets/sqlserver"],function(e){r&&(r.exports=e)})}()})(p);var o=p.exports;const u=i(o),T=c({__proto__:null,default:u},[o]);export{T as s};
