#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cstdlib>
#include <algorithm>
#include <vector>
#include <string>
using namespace std;

struct SegmentNode
{
	int mSecondStructureType; //0 : Loop; 1 : Sheet; 2 Helix;
	string mID;
	double mX, mY, mZ;
};

struct SecondStructure
{
	string mStart, mEnd;
};

string DelSpace(string s)
{
	string ret = "";
	for (const char & chr : s)
		if (chr != ' ')
			ret += chr;
	return ret;
}

void Mark(string startID, string endID, int type, vector<SegmentNode> &seg)
{
	size_t start = 0;
	while (start < seg.size() && seg[start].mID != startID)
		start++;
	bool flagLast = false;
	while (start < seg.size() && ((!flagLast) || (seg[start].mID == endID)))
	{
		if (seg[start].mID == endID)
			flagLast = true;
		seg[start].mSecondStructureType = type;
		start++;
	}
}

void ShowHelp()
{
	cout << " Usage pdb2json [pdb file name] [json file name]" << endl;
}

int main(int argc, char** argv)
{
	if (argc < 3)
	{
		ShowHelp();
		return 0;
	}
	vector<SegmentNode> atoms;
	vector<SecondStructure> helix;
	vector<SecondStructure> sheet;

	char* pdbFileName = argv[1];
	char* jsonFileName = argv[2];
	FILE* pdbFile = fopen(pdbFileName, "r");
	const size_t MAX_LINE_LEN = 1000;
	char line[MAX_LINE_LEN + 10];
	while (fgets(line, MAX_LINE_LEN, pdbFile))
	{
		string lineString = line;
		if (lineString.substr(0, 4) == "ATOM")
		{
			if (lineString.substr(13, 3) == "CA ")
			{
				SegmentNode node;
				sscanf(line + 30, "%lf", &node.mX);
				sscanf(line + 38, "%lf", &node.mY);
				sscanf(line + 46, "%lf", &node.mZ);
				node.mID = DelSpace(lineString.substr(21, 6));
				node.mSecondStructureType = 0;
				atoms.push_back(node);
			}
		}
		else if (lineString.substr(0, 5) == "HELIX")
		{
			SecondStructure secondStructure;
			secondStructure.mStart = DelSpace(lineString.substr(19, 7));
			secondStructure.mEnd = DelSpace(lineString.substr(31, 7));
			helix.push_back(secondStructure);
		}
		else if (lineString.substr(0, 5) == "SHEET")
		{
			SecondStructure secondStructure;
			secondStructure.mStart = DelSpace(lineString.substr(21, 6));
			secondStructure.mEnd = DelSpace(lineString.substr(32, 6));
			sheet.push_back(secondStructure);
		}
	}
	fclose(pdbFile);

	for (const auto &secondStructure : sheet)
	{
		Mark(secondStructure.mStart, secondStructure.mEnd, 1, atoms);
	//	cout << "sheet " << secondStructure.mStart << " " << secondStructure.mEnd << endl;
	}
	for (const auto &secondStructure : helix)
	{
		Mark(secondStructure.mStart, secondStructure.mEnd, 2, atoms);
	//	cout << "helix " << secondStructure.mStart << " " << secondStructure.mEnd << endl;
	}

	FILE* jsonFile = fopen(jsonFileName, "w");
	fprintf(jsonFile, "{\n\t\"atoms\":[\n");
	for (size_t i = 0; i < atoms.size(); ++i)
	{
		fprintf(jsonFile, "\t\t{");
		fprintf(jsonFile, "\"x\" : %.4f, \"y\" : %.4f, \"z\" : %.4f, \"type\" : %d, \"ID\" : \"%s\"}", atoms[i].mX, atoms[i].mY, atoms[i].mZ, atoms[i].mSecondStructureType, atoms[i].mID.c_str());
		if (i < atoms.size() - 1)
			fprintf(jsonFile, ",");
		fprintf(jsonFile, "\n");
	}
	fprintf(jsonFile, "\t]\n}\n");	
	return 0;
}


